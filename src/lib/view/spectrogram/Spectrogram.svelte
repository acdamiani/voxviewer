<script lang="ts">
  import { buffer, initResult } from '$lib/stores';
  import { get } from 'svelte/store';
  import { getContext, onMount } from 'svelte';
  import SpectrogramRenderer from './spectrogram';
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

  $: if (data) {
    try {
      renderer.render(data, 0);
    } catch (e: any) {
      setError(e);
    }
  }

  buffer.subscribe((b) => {
    if (!b) {
      return;
    }

    const result = get(initResult);

    if (!result) {
      throw new Error('Wasm instance was not initialized');
    }

    SpectrogramData.createFromAudioBuffer(result, b, {
      windowSize: 1024,
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

<div />
