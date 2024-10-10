FROM nginx:latest
WORKDIR /usr/src/app
ARG backend=bun

RUN if ["${backend}" = "bun"] ; then curl -fsSL https://bun.sh/install | bash ; else if ["${backend}" = "springboot"] ; then curl -fsSL https://bun.sh/install | bash ; else curl -fsSL https://bun.sh/install | bash ; fi

COPY ./web/* ./web
WORKDIR /usr/src/app/web
RUN bun i && bun run build && mv ./dist /usr/share/nginx/html

WORKDIR /usr/src/app
COPY ./server/* ./server
WORKDIR /usr/src/app/server
RUN bun i

USER nginx
EXPOSE 80/tcp 3000/tcp
COPY ./server/entrypoint.sh /
RUN ["chmod", "+x", "entrypoint.sh"]
CMD ["./entrypoint.sh"]
