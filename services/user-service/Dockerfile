# Path: services/user-service/Dockerfile

# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# install build deps
RUN apk add --no-cache python3 g++ make

# copy package files first for better caching
COPY package.json package-lock.json* ./

# install production deps only in builder (we'll copy node_modules to final)
RUN npm install --only=production

# copy source
COPY . .

# ---------- final runtime ----------
FROM node:20-alpine
WORKDIR /app

# create non-root user
RUN addgroup -S app && adduser -S -G app app
USER app

# copy production artifacts from builder
COPY --chown=app:app --from=builder /app /app

ENV NODE_ENV=production
EXPOSE 5000

# runtime command
CMD ["node", "src/index.js"]
