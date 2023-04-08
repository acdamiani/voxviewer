<script lang="ts">
  import ViewError from '$lib/error/ViewError.svelte';
  import { fade } from 'svelte/transition';
  import { setContext } from 'svelte';
  import { buffer } from '$lib/stores';

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

  export let view: 'spectrogram' | 'waveform' = 'waveform';
  export let channel: 0 | 1 = 0;

  const toggleView = () => {
    view = view === 'spectrogram' ? 'waveform' : 'spectrogram';
  };

  const toggleChannel = () => {
    channel = channel === 0 ? 1 : 0;
  };

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
  <div class="absolute top-0 left-8 flex gap-2 z-20">
    <button
      class="border border-t-0 border-neutral-800 bg-neutral-900 rounded-b-lg px-4 py-1 z-10 bg-opacity-75 cursor-pointer hover:bg-neutral-600 hover:text-neutral-200 hover:border-neutral-600 outline-none"
      on:click={toggleView}
    >
      <span class="uppercase text-xs font-semibold tracking-widest leading-none"
        >{view}</span
      >
    </button>
    {#if $buffer?.numberOfChannels > 1}
      <button
        class="border border-t-0 border-neutral-800 bg-neutral-900 rounded-b-lg px-4 py-1 z-10 bg-opacity-75 cursor-pointer hover:bg-neutral-600 hover:text-neutral-200 hover:border-neutral-600 outline-none"
        on:click={toggleChannel}
      >
        <span
          class="uppercase text-xs font-semibold tracking-widest leading-none"
          >{channel + 1}</span
        >
      </button>
    {/if}
  </div>
</div>
