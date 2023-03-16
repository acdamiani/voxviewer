<script lang="ts">
  import Ticker, { type TickerConfig } from './ticker';
  import { zoom, pan, buffer } from '$lib/stores';
  import { subscribe } from 'svelte/internal';
  import type { WasmAudioBuffer } from '$lib/audio/audio';

  let w: number;
  let h: number;

  let sd = 0;

  let zoomValue: number;
  subscribe(zoom, (zoom: number) => {
    zoomValue = zoom;
  });

  let panValue: number;
  subscribe(pan, (pan: number) => {
    panValue = pan;
  });

  let sampleRate: number;
  subscribe(buffer, (buffer: WasmAudioBuffer) => {
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
  on:wheel|nonpassive|preventDefault|stopPropagation={(e) => {
    const now = Date.now();

    if (e.ctrlKey) {
      if (now - sd < 10) {
        return;
      }

      const direction = e.detail < 0 || e.deltaY > 0 ? 1 : -1;

      if (direction === -1) {
        zoom.zoomIn();
        console.log('zooming in');
      } else {
        zoom.zoomOut();
        console.log('zooming out');
      }

      sd = now;
    } else {
      pan.update((p) => p + e.deltaY);
    }
  }}
/>

<div class="relative w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
  <canvas class="absolute top-0 left-0" bind:this={canvas} />
</div>
