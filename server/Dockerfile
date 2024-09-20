FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
