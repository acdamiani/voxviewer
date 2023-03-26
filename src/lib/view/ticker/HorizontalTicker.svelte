<script lang="ts">
  import Ticker, { type TickerConfig } from './ticker';
  import { zoom, pan, buffer } from '$lib/stores';
  import { subscribe } from 'svelte/internal';

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

  const keydown = (e: KeyboardEvent) => {
    const now = Date.now();

    if (e.ctrlKey) {
      if (now - sd < 10) {
        return;
      }

      switch (e.key) {
        case '=':
          e.preventDefault();
          zoom.zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoom.zoomOut();
          break;
      }
    }
  };

  const wheel = (e: WheelEvent) => {
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
  };
</script>

<svelte:window
  on:keydown|stopPropagation={keydown}
  on:wheel|nonpassive|preventDefault|stopPropagation={wheel}
/>

<div class="relative w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
  <canvas class="absolute top-0 left-0" bind:this={canvas} />
</div>
