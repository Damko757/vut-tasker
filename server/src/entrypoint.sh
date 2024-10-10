#!/bin/bash
cd /usr/src/app/server/
bun run src/index.ts & nginx -g "daemon off;"

