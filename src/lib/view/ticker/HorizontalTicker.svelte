<script lang="ts">
  import Ticker, { type TickerConfig } from './ticker';
  import { zoom, pan, buffer } from '$lib/stores';

  let w: number;
  let sampleRate: number | undefined;

  buffer.subscribe((b) => {
    sampleRate = b?.sampleRate;
  });

  let ticker: Ticker;

  $: if (container && sampleRate) {
    const config: TickerConfig = {
      containerWidth: w,
      sampleRate: sampleRate,
    };

    ticker = new Ticker(config);
  }

  let container: HTMLDivElement;
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
    ticker = ticker;
  }}
/>
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
</div>
