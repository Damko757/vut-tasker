# --- Stage 1: Build the Web Application ---
FROM node:22-trixie-slim AS builder
WORKDIR /app

# 1. Copy root and workspace package files first (optimizes Docker layer caching)
COPY package.json ./
COPY web/package.json ./web/

# 2. Install dependencies across the monorepo workspace
RUN npm install

# COPY THE ROOT .ENV FILE SO VITE CAN FIND IT VIA envDir: '../'
COPY .env ./
# 3. Copy the source code for shared and web
COPY shared/ ./shared/
COPY web/ ./web/

# 4. Build the application using your npm workspace script
# (Assuming your web package has a build script, e.g., "tsc && vite build")
RUN npm run build --workspace=web


# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine AS nginx

# Copy the built static files from the builder stage 
# (Adjust '/app/web/dist' if your Vite output directory is different, e.g., 'build')
COPY --from=builder /app/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]