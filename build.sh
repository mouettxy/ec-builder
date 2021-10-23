#!/usr/bin/env sh
set -e
pnpm build:app
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:newfox79/ec-builder.git master:gh-pages
cd -