import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import wasmPack from 'vite-plugin-wasm-pack';

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
      customCollections: {
        'window-functions': FileSystemIconLoader('./assets/window-icons'),
      },
      iconCustomizer(collection, _, props) {
        if (collection === 'window-functions') {
          props.width = '1.5em';
          props.height = '1.5em';
        }
      },
    }),
    wasmPack('./rs'),
  ],
});
