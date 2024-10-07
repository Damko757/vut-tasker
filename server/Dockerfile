FROM oven/bun:latest

COPY ./server/src ./src
COPY ./server/package.json ./
# COPY bun.lockb ./
COPY ./shared ../shared
COPY ./.env ../.env

RUN bun install

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
