<script lang="ts">
  import Ticker, { type TickerConfig } from './ticker';
  import { zoom, pan, buffer } from '$lib/stores';
  import { get } from 'svelte/store';
  import { subscribe } from 'svelte/internal';

  let w: number;
  let h: number;

  let zoomValue: number;
  subscribe(zoom, (zoom: number) => {
    zoomValue = zoom;
  });

  let panValue: number;
  subscribe(pan, (pan: number) => {
    panValue = pan;
  });

  let sampleRate: number;
  subscribe(buffer, (buffer: AudioBuffer) => {
    sampleRate = buffer?.sampleRate;
  });

  let canvas: HTMLCanvasElement;

  let ticker: Ticker;
  $: if (ticker) ticker.render(zoomValue, panValue);

  $: if (canvas && sampleRate) {
    const config: TickerConfig = {
      canvas: canvas,
      sampleRate: sampleRate,
    };

    ticker = new Ticker(config);
    ticker.render(zoomValue, panValue);
  }

  $: if (canvas) {
    canvas.width = w;
    canvas.height = h;
  }
</script>

<svelte:window
  on:wheel|nonpassive|preventDefault={(e) => {
    if (e.ctrlKey) {
      if (Math.abs(e.deltaY) > 100) {
        if (Math.sign(e.deltaY) === -1) {
          zoom.zoomIn();
        } else {
          zoom.zoomOut();
        }
      }
    } else {
      pan.update((p) => p + e.deltaY);
    }
  }}
/>

<div class="relative w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
  <canvas class="absolute top-0 left-0" bind:this={canvas} />
</div>

<!--
<div
  class="relative w-full h-full overflow-x-hidden"
  bind:this={container}
  bind:clientWidth={w}
>
  {#if container && ticker?.marks}
    <div class="absolute top-0 left-0 right-0">
      {#each ticker.marks as mark}
        {#if mark[1] !== null}
          <span
            class="absolute flex flex-col gap-[1px] items-center w-[2px]"
            style="left: {mark[0] - 1}px;"
          >
            <span class="w-[2px] h-6 bg-zinc-500 rounded-b-sm" />
            <span class="block">
              {mark[1]}
            </span>
          </span>
        {:else}
          <span
            class="absolute h-4 w-[2px] bg-zinc-600 rounded-b-sm"
            style="left: {mark[0] - 1}px;"
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>-->
