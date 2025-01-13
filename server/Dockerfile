FROM oven/bun:latest
WORKDIR /usr/src/app

COPY ./server/package.json ./

RUN bun install

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
