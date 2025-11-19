# Path: services/api-gateway/Dockerfile

# Small nginx image with config copy
FROM nginx:1.25-alpine

# Remove default server config (optional) and copy our config
# Expect nginx.conf or default.conf to be present in the build context
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Recommended: run as non-root is handled by nginx image; port 80 exposed by base image
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
