#!/bin/bash
set -e

ROLE=$1
JOIN_CMD=$2
REGISTRY=$3

disable_swap() {
    sudo swapoff -a
    sudo sed -i '/swap/d' /etc/fstab
}

install_containerd() {
    sudo apt update
    sudo apt install -y containerd
    sudo mkdir -p /etc/containerd
    containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
    sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
    sudo systemctl restart containerd
    sudo systemctl enable containerd

   sudo apt install -y docker.io
    sudo usermod -aG docker $USER && newgrp docker

}

install_kubernetes() {
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl

    sudo mkdir -p /etc/apt/keyrings
    sudo curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key \
      | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

    echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
    https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" \
    | sudo tee /etc/apt/sources.list.d/kubernetes.list

    sudo apt-get update
    sudo apt-get install -y kubelet kubeadm kubectl
    sudo apt-mark hold kubelet kubeadm kubectl
}

master_kubeadm_init() {
    sudo kubeadm init --pod-network-cidr=192.168.0.0/16
}

sync_project() {
    local DIR="${HOME}/Streamflix"
    local manifests_dir="${DIR}/k8s"
    local MAKEFILE="${DIR}/Makefile"

    # REGISTRY from argument 3
    local REGISTRY="$3"

    echo "[info] REGISTRY = ${REGISTRY}"

    if [[ -z "$REGISTRY" ]]; then
        echo "❌ REGISTRY not provided for sync_project"
        exit 1
    fi

    # --- Update YAML manifests ---
    if [[ -d "${manifests_dir}" ]]; then
        echo "[info] Updating k8s YAMLs with REGISTRY=${REGISTRY}"

        find "${manifests_dir}" -type f -name "*.yaml" -print0 | \
        xargs -0 sed -i \
            -e "s|\${REGISTRY}|${REGISTRY}|g"
    else
        echo "[warn] k8s directory not found; skipping YAML update"
    fi

    # --- Update Makefile ---
    if [[ -f "${MAKEFILE}" ]]; then
        echo "[info] Updating Makefile with REGISTRY=${REGISTRY}"

        sed -i \
            -e "s|\${REGISTRY}|${REGISTRY}|g" \
            "${MAKEFILE}"
    else
        echo "[warn] Makefile not found; skipping"
    fi

    echo "✅ sync_project completed successfully"
}


setup_kubeconfig() {
    mkdir -p $HOME/.kube
    sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
}

install_cni() {
    kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
}

generate_join_cmd() {
    kubeadm token create --print-join-command
}

worker_join() {
    sudo $JOIN_CMD --cri-socket=unix:///run/containerd/containerd.sock --v=5
}

###############################################
# MAIN LOGIC
###############################################

if [[ "$ROLE" == "master" ]]; then

    echo "🚀 Setting up Kubernetes MASTER node"

    disable_swap
    install_containerd
    install_kubernetes

    # master init first
    master_kubeadm_init
    setup_kubeconfig

    # now sync project with MASTER_IP + REGISTRY
    sync_project

    install_cni

    echo "==================================="
    echo "🔑 Worker Join Command:"
    generate_join_cmd
    echo "==================================="

elif [[ "$ROLE" == "worker" ]]; then

    echo "🚀 Setting up Kubernetes WORKER node"

    if [[ -z "$JOIN_CMD" ]]; then
        echo "❌ ERROR: JOIN COMMAND NOT PROVIDED"
        echo "Usage: ./k8s.sh worker \"<JOIN_CMD>\""
        exit 1
    fi

    disable_swap
    install_containerd
    install_kubernetes
    worker_join

    echo "🎉 Worker joined successfully!"

else
    echo "❌ Invalid option: $ROLE"
    echo "Usage:"
    echo "  ./k8s.sh master <DOCKERHUB-USERNAME>"
    echo "  ./k8s.sh worker \"<JOIN_COMMAND>\""
    exit 1
fi
