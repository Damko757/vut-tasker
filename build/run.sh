sh ./stop.sh
sh ./mongo-run.sh
sh ./web-run.sh
sudo docker compose up -d cloudflare
# sh ./bun-run.sh