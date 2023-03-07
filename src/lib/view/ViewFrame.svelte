<script lang="ts">
  import Loader from '$lib/Loader.svelte';
  import { setContext } from 'svelte';

  let htmlCanvas: HTMLCanvasElement;

  setContext('canvas', {
    getCanvas: () => htmlCanvas,
  });

  let w: number, h: number;

  $: if (htmlCanvas) {
    htmlCanvas.width = w;
    htmlCanvas.height = h;
  }

  export let title = 'title';
</script>

<div
  class="h-full min-h-[16rem] relative border-t-2 border-zinc-800"
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  <div
    class="absolute top-0 left-8 bg-zinc-800 rounded-b-lg opacity-50 px-4 py-1"
  >
    <span class="uppercase text-xs font-semibold tracking-widest leading-none"
      >{title}</span
    >
  </div>
  <slot />
  <canvas class="absolute top-0 left-0" bind:this={htmlCanvas} />
</div>
