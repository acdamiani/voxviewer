<script lang="ts">
  import decimal from 'decimal.js';
  import { onMount } from 'svelte';
  import Ticker from './ticker';

  let dirty = 0;

  let w: number;

  let ticker: Ticker;
  onMount(() => {
    ticker = new Ticker(0, 1, container.clientWidth, 32);
  });

  $: if (container) {
    ticker = new Ticker(0, 1, w, 32);
  }

  let container: HTMLDivElement;
</script>

<svelte:window
  on:wheel|nonpassive|preventDefault={(e) => {
    if (e.ctrlKey) {
      if (Math.abs(e.deltaY) > 100) {
        if (Math.sign(e.deltaY) === -1) {
          ticker.zoomIn();
        } else {
          ticker.zoomOut();
        }
      }
    } else {
      ticker.pan(e.deltaY / 500);
    }

    ticker = ticker;
  }}
/>
<div
  class="relative w-full h-full overflow-x-hidden"
  bind:this={container}
  bind:clientWidth={w}
>
  {#if container && ticker.marks}
    <div class="absolute top-0 left-0 right-0">
      {#each ticker.marks as mark, i}
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
