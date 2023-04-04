<script lang="ts">
  import { buffer, zoom, pan, player, playerPositionPixels } from '$lib/stores';
  import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';

  let position: number;
  let offset: number;

  const fromPixel = (pixel: number): number => {
    return (
      ($zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL * (pixel + $pan)) /
      $buffer.sampleRate
    );
  };

  const mouseMove = (e: MouseEvent) => {
    position = Math.max(padding, e.clientX - offset);

    if (dragging) {
      $player.seek(fromPixel(position));
    }
  };

  let clickableArea: HTMLDivElement;

  $: if (clickableArea) {
    offset = clickableArea.getBoundingClientRect().left;
  }

  export let padding = 0;

  let dragging: boolean;

  const beginDrag = () => {
    dragging = true;
    $player.seek(fromPixel(position));
  };

  const mouseDown = (e: MouseEvent) => {
    if (!clickableArea) {
      return;
    }

    const rect = clickableArea.getBoundingClientRect();
    if (
      e.button !== 0 ||
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY > rect.bottom ||
      e.clientY < rect.top
    ) {
      return;
    }

    beginDrag();
  };

  const mouseUp = () => {
    dragging = false;
  };
</script>

<svelte:window
  on:mousemove={mouseMove}
  on:mousedown={mouseDown}
  on:mouseup={mouseUp}
/>

{#if $buffer}
  <div class="block absolute inset-0 invisible" bind:this={clickableArea} />

  <div
    class="absolute inset-0 right-auto w-px bg-neutral-700 bg-opacity-25"
    style="transform: translateX({position}px);"
  />

  <div
    class="flex flex-col absolute inset-0 -top-5 right-auto items-center opacity-75"
    style="transform: translateX({$playerPositionPixels - 7}px);"
  >
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="{dragging
        ? 'cursor-grabbing'
        : 'cursor-grab'} flex-shrink-0 -mb-px"
      on:mousedown={beginDrag}
    >
      <path
        d="M0 2C0 0.89543 0.89543 0 2 0H11.8249C12.9295 0 13.8249 0.89543 13.8249 2V14.9568C13.8249 15.6807 13.4337 16.3481 12.8021 16.7018L7.88965 19.4528C7.28253 19.7927 6.54235 19.7927 5.93524 19.4528L1.02279 16.7018C0.39118 16.3481 0 15.6807 0 14.9568V2Z"
        fill="#DC2626"
      />
    </svg>
    <div class="h-full w-0.5 bg-red-600" />
  </div>
{/if}
