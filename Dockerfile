# Multi-stage Dockerfile for BalaBoard (Vite Frontend + WebSocket Sync Server)

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5175
ENV WS_PORT=5176

COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Install serve for static production frontend
RUN npm install -g serve

EXPOSE 5175 5176

# Start both static server and sync server
CMD ["sh", "-c", "node server/syncServer.js & serve -s dist -l 5175"]
