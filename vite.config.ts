import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import wasmPack from 'vite-plugin-wasm-pack';

export default defineConfig({
  plugins: [sveltekit(), Icons({ compiler: 'svelte' }), wasmPack('./rs')],
});
