# ─── Stage 1: Build Frontend ───────────────────────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy root package.json for frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code (includes .env.production)
COPY . .

# Build the React app (Vite picks up .env.production automatically)
RUN npm run build


# ─── Stage 2: Production Server ────────────────────────────────
FROM node:20-alpine AS production-stage

WORKDIR /app/server

# Copy server package.json
COPY server/package*.json ./

# Install ONLY production dependencies (no devDependencies)
RUN npm install --omit=dev

# Copy server source code
COPY server/src ./src

# Copy built frontend from Stage 1
COPY --from=build-stage /app/dist /app/dist

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
