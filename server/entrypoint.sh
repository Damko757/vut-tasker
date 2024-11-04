#!/bin/bash
cd /usr/src/app/server/
~/.bun/bin/bun run src/index.ts & nginx -g "daemon off;"

