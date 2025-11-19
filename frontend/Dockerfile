# Path: frontend/Dockerfile

# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies for building
COPY nextjs-app/package.json nextjs-app/package-lock.json* ./
RUN npm install

# copy app and build
COPY nextjs-app ./
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S -G app app
USER app

# copy build output and package.json to run
COPY --from=builder --chown=app:app /app /app

ENV NODE_ENV=production
EXPOSE 3000

# Use next start (production) — ensure your next.config.js supports server mode
CMD ["npm", "start"]
