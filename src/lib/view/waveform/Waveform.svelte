<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { buffer, zoom, pan } from '$lib/stores';
  import Loader from '$lib/Loader.svelte';
  import WaveformRenderer from './waveform';

  const {
    getCanvas,
    getOffscreenCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
    getOffscreenCanvas: () => HTMLCanvasElement;
  } = getContext('canvas');
  let renderer: WaveformRenderer;

  let loading = false;

  let zoomValue: number;
  let panValue: number;
  let bufferValue: AudioBuffer | null;

  zoom.subscribe((z) => {
    zoomValue = z;
  });

  pan.subscribe((p) => {
    panValue = p;
  });

  buffer.subscribe((b) => {
    bufferValue = b;
  });

  $: if (zoomValue && bufferValue && renderer) {
    loading = true;
    renderer.render(bufferValue, zoomValue, panValue).then(() => {
      loading = false;
    });
  }

  onMount(() => {
    renderer = new WaveformRenderer(getCanvas(), getOffscreenCanvas());
  });
</script>

<div class="flex-0 basis-16" />
{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader />
  </div>
{/if}
