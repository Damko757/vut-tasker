# --- Stage 1: Build the Server & Shared packages ---
FROM node:22-alpine AS builder
WORKDIR /app

# 1. Copy root and workspace package manifests
COPY package.json ./
COPY server/package.json ./server/

# 2. Install all dependencies (resolves workspace links)
RUN npm install

# 3. Copy source files
COPY shared/ ./shared/
COPY server/ ./server/

# 4. Compile TypeScript for both packages
RUN npm run build --workspaces


# --- Stage 2: Production Runtime ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary production artifacts from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist

# Switch to the built-in non-root 'node' user for security
USER node

WORKDIR /app/server
EXPOSE 3000

# Run the compiled JavaScript directly with Node.js
CMD ["node", "dist/server/src/index.js"]