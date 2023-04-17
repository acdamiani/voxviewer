# VoxViewer

<div align="center">
    <img src="https://user-images.githubusercontent.com/65556364/232362028-58da415d-2202-4b65-961b-907876547142.png" alt=""/>
</div>

My entry for the SvelteHack 2023 competition. An experiment with WebAssembly, Web Workers, SvelteKit, and the Web Audio API.

## Requirements

To run this project locally, you'll need the following software installed:

- <a href="https://nodejs.org/">Node.js</a>
- <a href="https://pnpm.io/">pnpm</a>
- <a href="https://rustwasm.github.io/wasm-pack/installer/">wasm-pack</a>
- <a href="https://rustup.rs/">rustup</a>

## See the project in action

https://user-images.githubusercontent.com/65556364/232364974-e6f58a2f-f4a6-4256-8115-b62e85550175.mp4

## Running the Project

Get started by cloning the repository using the following command:

```bash
git clone git@github.com:acdamiani/cryptools.git
```

Then, do some project installation.

```bash
# install pnpm dependencies
pnpm install

# build the Rust crate
pnpm build:wasm
```

## Developing

Once you've cloned the project, installed dependencies, and built the Rust crate, start a development server:

```bash
pnpm dev
```

If you want to preview the built version of the project (make sure you run `pnpm build:wasm` first):

```bash
# build the project
pnpm build

# preview the built project
pnpm preview
```
