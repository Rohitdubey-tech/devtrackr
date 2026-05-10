# ─── Stage 1: Build Frontend ───────────────────────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app/frontend

# Copy frontend package.json
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend code
COPY frontend/ ./

# Build the React app
RUN npm run build


# ─── Stage 2: Production Server ────────────────────────────────
FROM node:20-alpine AS production-stage

WORKDIR /app/backend

# Copy backend package.json
COPY backend/package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY backend/src ./src
COPY backend/.env* ./

# Copy built frontend from Stage 1 into the new expected path
COPY --from=build-stage /app/frontend/dist /app/frontend/dist

# ── Environment ──────────────────────────────────────────────
ENV NODE_ENV=production
ENV PORT=8080

# App Runner uses port 8080 by default
EXPOSE 8080

# Health check so App Runner knows when the container is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/v1/health || exit 1

# Start the server
CMD ["node", "src/server.js"]
