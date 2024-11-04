FROM nginx:latest
WORKDIR /usr/src/app
ARG backend=bun

RUN apt-get update && apt-get install -y unzip && curl -fsSL https://bun.sh/install | bash

#RUN if ["${backend}" -eq "bun"] ; then curl -fsSL https://bun.sh/install | bash ; fi
COPY . .
WORKDIR /usr/src/app/web
RUN if [ "${backend}" = "bun" ]; then  ~/.bun/bin/bun i && ~/.bun/bin/bunx --bun vite build && cd /usr/share/nginx/html && rm ./index.html && cd /usr/src/app/web && cp -r ./dist/* /usr/share/nginx/html; fi
#&& ~/.bun/bin/bunx --bun vite build
WORKDIR /usr/src/app/server
RUN if [ "${backend}" = "bun" ]; then ~/.bun/bin/bun i && cp ./nginx.conf /etc/nginx/conf.d/default.conf; fi
#&& cp ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /
USER root
EXPOSE 80/tcp 3000/tcp
COPY ./server/entrypoint.sh ./
#RUN ["chmod", "+x", "./entrypoint.sh"]
CMD ["./entrypoint.sh"]
