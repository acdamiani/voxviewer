<script lang="ts">
  import Ticker, { type TickerConfig } from './ticker';
  import { zoom, pan, buffer, playerPositionPixels } from '$lib/stores';
  import { subscribe } from 'svelte/internal';

  let w: number;
  let h: number;

  let sd = 0;

  let sampleRate: number;
  subscribe(buffer, (buffer: AudioBuffer) => {
    sampleRate = buffer?.sampleRate;
  });

  let canvas: HTMLCanvasElement;

  let ticker: Ticker;
  $: if (ticker) ticker.render($zoom, $pan);

  $: if (canvas && sampleRate) {
    const config: TickerConfig = {
      canvas: canvas,
      sampleRate: sampleRate,
    };

    ticker = new Ticker(config);
    ticker.render($zoom, $pan);
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
          zoom.zoomIn($playerPositionPixels);
          e.preventDefault();
          break;
        case '-':
          zoom.zoomOut($playerPositionPixels);
          e.preventDefault();
          break;
      }
    }

    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        pan.update(($pan) => $pan - (e.shiftKey ? 100 : 25));
        e.preventDefault();
        break;
      case 'd':
      case 'arrowright':
        pan.update(($pan) => $pan + (e.shiftKey ? 100 : 25));
        e.preventDefault();
        break;
    }
  };

  const wheel = (e: WheelEvent) => {
    const now = Date.now();

    if (e.ctrlKey) {
      e.preventDefault();

      if (now - sd < 10) {
        return;
      }

      const direction = e.detail < 0 || e.deltaY > 0 ? 1 : -1;

      if (direction === -1) {
        zoom.zoomIn($playerPositionPixels);
      } else {
        zoom.zoomOut($playerPositionPixels);
      }

      sd = now;
    } else if (Math.abs(e.deltaX) > 0) {
      pan.update(($pan) => $pan + e.deltaX);
      e.preventDefault();
    }
  };
</script>

<svelte:window
  on:keydown|stopPropagation={keydown}
  on:wheel|nonpassive|stopPropagation={wheel}
/>

<div class="relative w-full h-full" bind:clientWidth={w} bind:clientHeight={h}>
  <canvas class="absolute top-0 left-0" bind:this={canvas} />
</div>
