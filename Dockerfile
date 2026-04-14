# ─── Stage 1: Build Frontend ───────────────────────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy root package.json for frontend dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .

# Build the React app
RUN npm run build


# ─── Stage 2: Production Server ────────────────────────────────
FROM node:20-alpine AS production-stage

WORKDIR /app/server

# Copy server package.json
COPY server/package*.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# Copy built frontend from Stage 1
COPY --from=build-stage /app/dist /app/dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=5001

# Expose the API port
EXPOSE 5001

# Start the server
CMD ["node", "src/server.js"]
