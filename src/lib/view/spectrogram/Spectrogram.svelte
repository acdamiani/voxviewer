<script lang="ts">
  import { buffer, zoom } from '$lib/stores';
  import { getContext, onMount } from 'svelte';
  import SpectrogramRenderer from './spectrogram-renderer';
  import SpectrogramData from './spectrogram-data';
  import SpectrogramLoader from '$lib/loaders/SpectrogramLoader.svelte';
  import { getWorkerSupport, type WorkerSupport } from '$lib/util/support';

  const {
    getCanvas,
    getOffscreenCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
    getOffscreenCanvas: () => HTMLCanvasElement;
  } = getContext('__pyv_canvas');

  const {
    setError,
  }: {
    setError: (err: Error | null) => void;
  } = getContext('__pyv_error');

  let data: SpectrogramData;
  let renderer: SpectrogramRenderer;

  let loading = false;

  let zoomValue: number;
  zoom.subscribe((zoom) => {
    zoomValue = zoom;
  });

  let workerSupport: WorkerSupport;
  onMount(() => {
    workerSupport = getWorkerSupport();
  });

  $: if (data) {
    try {
      renderer.render(data, 0, zoomValue);
    } catch (e: any) {
      setError(e);
    }
  }

  buffer.subscribe((b) => {
    if (!b) {
      return;
    }

    loading = true;

    console.log(workerSupport);

    SpectrogramData.createFromAudioBuffer(b, {
      webWorker:
        (import.meta.env.PROD && workerSupport > 0) ||
        (import.meta.env.DEV && workerSupport > 1),
      windowSize: 2048,
    })
      .then((spectrogramData) => {
        data = spectrogramData;
      })
      .catch((e: Error) => {
        setError(e);
      })
      .finally(() => {
        loading = false;
      });

    setError(null);
  });

  onMount(() => {
    renderer = new SpectrogramRenderer(getCanvas(), getOffscreenCanvas());
  });
</script>

<div class="flex-none basis-16" />

{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <SpectrogramLoader />
  </div>
{/if}
