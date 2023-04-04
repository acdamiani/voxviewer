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
        'window-functions': FileSystemIconLoader(
          './src/lib/assets/window-icons',
        ),
      },
      iconCustomizer(collection, icon, props) {
        switch (collection) {
          case 'window-functions':
            props.width = '1.5em';
            props.height = '1.5em';
            break;
          case 'octicon':
            if (icon.endsWith('24')) {
              props.width = '1.5em';
              props.height = '1.5em';
            } else {
              props.width = '1em';
              props.height = '1em';
            }
            break;
        }
      },
    }),
    wasmPack('./rs'),
  ],
});
