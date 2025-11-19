# Makefile — Streamflix Blue/Green Deployment
# ===========================================
# Author: Gaurav Chile
# Desc: Unified automation for building, pushing, deploying and switching traffic.

NAMESPACE=streamflix

# -------------------------------------------
# DOCKER COMPOSE (LOCAL DEV)
# -------------------------------------------

.PHONY: up down build images docker create-v1 create-v2 push-v1 push-v2 \
        k8s-apply k8s-delete switch-blue switch-green seed clean

up:
	@echo "🚀 Starting local Docker Compose..."
	docker-compose up -d

down:
	@echo "🛑 Stopping Docker Compose..."
	docker-compose down

build:
	@echo "🔨 Building docker-compose services..."
	docker-compose build --parallel

images: build

# -------------------------------------------
# BLUE/GREEN IMAGE BUILDS
# -------------------------------------------

docker: create-v1 create-v2 push-v1 push-v2

create-v1:
	@echo "🔵 Building BLUE images..."
	docker build -t  ${REGISTRY}/user-service:v1 ./services/user-service
	docker build -t  ${REGISTRY}/movie-service:v1 ./services/movie-service
	docker build -t  ${REGISTRY}/rating-service:v1 ./services/rating-service
	docker build -t  ${REGISTRY}/recommendation-service:v1 ./services/recommendation-service
	docker build -t  ${REGISTRY}/api-gateway:v1 ./services/api-gateway
	docker build -t  ${REGISTRY}/frontend:v1 ./frontend

create-v2:
	@echo "🟢 Building GREEN images..."
	docker build -t  ${REGISTRY}/user-service:v2 ./services/user-service
	docker build -t  ${REGISTRY}/movie-service:v2 ./services/movie-service
	docker build -t  ${REGISTRY}/rating-service:v2 ./services/rating-service
	docker build -t  ${REGISTRY}/recommendation-service:v2 ./services/recommendation-service
	docker build -t  ${REGISTRY}/api-gateway:v2 ./services/api-gateway
	docker build -t  ${REGISTRY}/frontend:v2 ./frontend

push-v1:
	@echo "📤 Pushing BLUE images..."
	docker push  ${REGISTRY}/user-service:v1
	docker push  ${REGISTRY}/movie-service:v1
	docker push  ${REGISTRY}/rating-service:v1
	docker push  ${REGISTRY}/recommendation-service:v1
	docker push  ${REGISTRY}/api-gateway:v1
	docker push  ${REGISTRY}/frontend:v1

push-v2:
	@echo "📤 Pushing GREEN images..."
	docker push  ${REGISTRY}/user-service:v2
	docker push  ${REGISTRY}/movie-service:v2
	docker push  ${REGISTRY}/rating-service:v2
	docker push  ${REGISTRY}/recommendation-service:v2
	docker push  ${REGISTRY}/api-gateway:v2
	docker push  ${REGISTRY}/frontend:v2

# -------------------------------------------
# KUBERNETES APPLY
# -------------------------------------------

k8s-apply:
	@echo "🚢 Deploying Streamflix to Kubernetes..."
	kubectl apply -f k8s/ -n $(NAMESPACE)

k8s-delete:
	@echo "🧹 Deleting ALL Streamflix Kubernetes resources..."
	kubectl delete -f k8s/ -n $(NAMESPACE)

# -------------------------------------------
# BLUE/GREEN TRAFFIC SWITCH
# -------------------------------------------

switch-blue:
	@echo "🔄 Switching traffic to BLUE..."
	kubectl -n $(NAMESPACE) patch svc user-service -p '{"spec":{"selector":{"version":"blue"}}}'
	kubectl -n $(NAMESPACE) patch svc movie-service -p '{"spec":{"selector":{"version":"blue"}}}'
	kubectl -n $(NAMESPACE) patch svc rating-service -p '{"spec":{"selector":{"version":"blue"}}}'
	kubectl -n $(NAMESPACE) patch svc recommendation-service -p '{"spec":{"selector":{"version":"blue"}}}'
	kubectl -n $(NAMESPACE) patch svc api-gateway -p '{"spec":{"selector":{"version":"blue"}}}'
	kubectl -n $(NAMESPACE) patch svc frontend -p '{"spec":{"selector":{"version":"blue"}}}'

switch-green:
	@echo "🔄 Switching traffic to GREEN..."
	kubectl -n $(NAMESPACE) patch svc user-service -p '{"spec":{"selector":{"version":"green"}}}'
	kubectl -n $(NAMESPACE) patch svc movie-service -p '{"spec":{"selector":{"version":"green"}}}'
	kubectl -n $(NAMESPACE) patch svc rating-service -p '{"spec":{"selector":{"version":"green"}}}'
	kubectl -n $(NAMESPACE) patch svc recommendation-service -p '{"spec":{"selector":{"version":"green"}}}'
	kubectl -n $(NAMESPACE) patch svc api-gateway -p '{"spec":{"selector":{"version":"green"}}}'
	kubectl -n $(NAMESPACE) patch svc frontend -p '{"spec":{"selector":{"version":"green"}}}'

# -------------------------------------------
# DATABASE SEED
# -------------------------------------------

seed:
	@echo "🌱 Seeding Postgres, Mongo, Redis..."
	node seed/postgres-seed.js
	node seed/mongo-seed.js
	node seed/redis-seed.js || true

# -------------------------------------------
# CLEAN DOCKER ENV
# -------------------------------------------

clean:
	@echo "🧽 Cleaning Docker environment..."
	docker-compose down --rmi all --volumes --remove-orphans || true
