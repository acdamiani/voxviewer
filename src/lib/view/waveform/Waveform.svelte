<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { zoom, pan, audio } from '$lib/stores';
  import Loader from '$lib/Loader.svelte';
  import WaveformRenderer from './waveform';

  const {
    getCanvas,
    getOffscreenCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
    getOffscreenCanvas: () => HTMLCanvasElement;
  } = getContext('__pyv_canvas');

  const { setError }: { setError: (err: Error | null) => void } =
    getContext('__pyv_error');

  let renderer: WaveformRenderer;

  let loading = false;

  let zoomValue: number;
  let panValue: number;
  let buffer: AudioBuffer;

  zoom.subscribe((z) => {
    zoomValue = z;
  });

  pan.subscribe((p) => {
    panValue = p;
  });

  audio.subscribe((a) => {
    if (!a) {
      return;
    }

    a.load()
      .then((b) => {
        buffer = b.buffer;
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  });

  $: if (zoomValue && buffer && renderer) {
    loading = true;
    renderer.render(buffer, zoomValue, panValue).then(() => {
      loading = false;
    });
  }

  onMount(() => {
    renderer = new WaveformRenderer(getCanvas(), getOffscreenCanvas());
  });
</script>

<div class="flex-none basis-16" />
{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader />
  </div>
{/if}
