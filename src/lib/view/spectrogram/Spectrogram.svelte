<script lang="ts">
  import { buffer, zoom } from '$lib/stores';
  import { getContext, onMount } from 'svelte';
  import SpectrogramRenderer from './spectrogram-renderer';
  import SpectrogramData from './spectrogram-data';

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

  let zoomValue: number;
  zoom.subscribe((zoom) => {
    zoomValue = zoom;
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

    SpectrogramData.createFromAudioBuffer(b, {
      webWorker: false,
      windowSize: 2048,
    })
      .then((spectrogramData) => {
        data = spectrogramData;
      })
      .catch((e: Error) => {
        setError(e);
      });

    setError(null);
  });

  onMount(() => {
    renderer = new SpectrogramRenderer(getCanvas(), getOffscreenCanvas());
  });
</script>

<div class="flex-none basis-16" />
