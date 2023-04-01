<script lang="ts">
  import ViewError from '$lib/error/ViewError.svelte';
  import { setContext } from 'svelte';

  let htmlCanvas: HTMLCanvasElement;
  let offscreenCanvas: HTMLCanvasElement;

  setContext('__pyv_canvas', {
    getCanvas: () => htmlCanvas,
    getOffscreenCanvas: () => offscreenCanvas,
  });

  setContext('__pyv_error', {
    setError: (err: Error | null) => (error = err),
  });

  let w: number, h: number;

  $: if (htmlCanvas) {
    htmlCanvas.width = w;
    htmlCanvas.height = h;
  }

  export let title = 'title';

  let error: Error | null = null;
</script>

<div class="h-full relative border-t border-neutral-800 flex">
  {#if error}
    <ViewError {error} />
  {:else}
    <slot />
  {/if}
  <div
    class="relative w-full h-full"
    bind:clientWidth={w}
    bind:clientHeight={h}
  >
    <canvas class="absolute top-0 left-0" bind:this={htmlCanvas} />
    <canvas hidden bind:this={offscreenCanvas} />
  </div>
  <div
    class="absolute top-0 left-8 border border-t-0 border-neutral-800 bg-neutral-900 rounded-b-lg px-4 py-1"
  >
    <span class="uppercase text-xs font-semibold tracking-widest leading-none"
      >{title}</span
    >
  </div>
</div>
