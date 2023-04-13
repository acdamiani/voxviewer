<script lang="ts">
  import { buffer, zoom, pan, settings } from '$lib/stores';
  import { getContext, onMount } from 'svelte';
  import SpectrogramRenderer from './spectrogram-renderer';
  import SpectrogramData from './spectrogram-data';
  import SpectrogramLoader from '$lib/loaders/SpectrogramLoader.svelte';
  import { getWorkerSupport, type WorkerSupport } from '$lib/util/support';

  const {
    getCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
  } = getContext('__vv_canvas');

  const {
    setError,
  }: {
    setError: (err: Error | null) => void;
  } = getContext('__vv_error');

  let data: SpectrogramData;
  let renderer: SpectrogramRenderer;

  let loading = false;

  let workerSupport: WorkerSupport;
  onMount(() => {
    workerSupport = getWorkerSupport();
  });

  $: if (data) {
    renderer.render(data, channel, $zoom, $pan).catch((e) => setError(e));
  }

  $: if ($buffer) {
    loading = true;
    renderer?.clear();

    SpectrogramData.createFromAudioBuffer($buffer, {
      webWorker:
        (import.meta.env.PROD && workerSupport > 0) ||
        (import.meta.env.DEV && workerSupport > 1),
      ...$settings,
    })
      .then((res) => {
        data = res;
      })
      .catch((e: Error) => {
        setError(e);
      })
      .finally(() => {
        loading = false;
      });

    setError(null);
  }

  onMount(() => {
    renderer = new SpectrogramRenderer(getCanvas());
  });

  let resizeId: number;

  const onResize = () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(() => {
      if (data) {
        renderer.render(data, channel, $zoom, $pan).catch((e) => setError(e));
      }
    }, 100);
  };

  export let channel: 0 | 1 = 0;
</script>

<svelte:window on:resize={onResize} />

{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <SpectrogramLoader />
  </div>
{/if}
