#! /bin/bash

if !command -v js &> /dev/null
then
  echo "jq command not found"
  exit 127
fi

if !command -v wasm-pack &> /dev/null
then
  echo "wasm-pack command not found"
  exit 127
fi

if [ ! -d "./rs" ]
then
  echo "could not find crate \"rs\""
  exit 2
fi

cd rs
wasm-pack build --target web

tmp=$(mktemp)

cd pkg
jq ". += { type: \"module\" }" package.json > "$tmp" && mv "$tmp" package.json
