<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { zoom, pan, buffer } from '$lib/stores';
  import Loader from '$lib/Loader.svelte';
  import WaveformRenderer from './waveform';
  import WaveformLoader from '$lib/loaders/WaveformLoader.svelte';
  import WaveformData from 'waveform-data';
  import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';

  const {
    getCanvas,
    getOffscreenCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
    getOffscreenCanvas: () => HTMLCanvasElement;
  } = getContext('__pyv_canvas');

  const { setError }: { setError: (err: Error | null) => void } =
    getContext('__pyv_error');

  let data: WaveformData;
  let renderer: WaveformRenderer;

  let loading = false;

  let zoomValue: number;
  zoom.subscribe((z) => {
    zoomValue = z;
  });

  let panValue: number;
  pan.subscribe((p) => {
    panValue = p;
  });

  buffer.subscribe((b) => {
    if (!b) {
      return;
    }

    loading = true;

    WaveformData.createFromAudio(
      { audio_buffer: b, scale: WAVEFORM_BASE_SAMPLES_PER_PIXEL },
      (err, waveformData) => {
        if (err) {
          setError(err);
        } else {
          data = waveformData;
          loading = false;
        console.log(b);
        }
      },
    );
  });

  $: if (data) {
    try {
      renderer.render(data, zoomValue, panValue);
    } catch (e: any) {
      setError(e);
    }
  }

  onMount(() => {
    renderer = new WaveformRenderer(getCanvas());
  });
</script>

<div class="flex-none basis-16" />
{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <WaveformLoader />
  </div>
{/if}
