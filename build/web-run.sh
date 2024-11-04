cd ../web
bun i
bun run vite build
cd ../server
bun i
cd ..
sudo docker compose up -d --force-recreate --build web