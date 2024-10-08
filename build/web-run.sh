cd ../web
bun i
bun run vite build
cd ..
sudo docker compose up -d --force-recreate web