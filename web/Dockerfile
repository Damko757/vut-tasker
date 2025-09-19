FROM oven/bun:latest AS builder
WORKDIR /usr/src/app

COPY ./web .
COPY ./shared ../shared

# Dependency installing
RUN bun install 
# Building
RUN bun run buildx

FROM nginx:latest AS nginx

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]