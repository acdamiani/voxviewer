#! /bin/bash

yum install jq -y
amazon-linux-extras install rust1
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd rs
wasm-pack build --target web

tmp=$(mktemp)

cd pkg
jq ". += { type: \"module\" }" package.json > "$tmp" && mv "$tmp" package.json

cd ../../
pnpm build