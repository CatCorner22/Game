#!/bin/sh
# Boot the dev server if it is not already answering.
#
# Resolve the repo from this script's own location rather than a hardcoded
# path: the same script has to work in the sandbox (/workspace), on Replit
# (/home/runner/<repl>) and in a local clone. PORT follows vite.config.ts.
set -eu
cd "$(dirname "$0")"
PORT="${PORT:-8080}"
if curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:${PORT}/"; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
