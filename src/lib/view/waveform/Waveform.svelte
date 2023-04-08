<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { zoom, pan, buffer } from '$lib/stores';
  import WaveformRenderer from './waveform';
  import WaveformLoader from '$lib/loaders/WaveformLoader.svelte';
  import WaveformData from 'waveform-data';
  import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';
  import { cloneAudioBuffer } from '$lib/util/support';

  const {
    getCanvas,
  }: {
    getCanvas: () => HTMLCanvasElement;
  } = getContext('__pyv_canvas');

  const { setError }: { setError: (err: Error | null) => void } =
    getContext('__pyv_error');

  let data: WaveformData;
  let renderer: WaveformRenderer;

  let loading = false;

  buffer.subscribe((b) => {
    if (!b) {
      return;
    }

    loading = true;

    // HACK: Since waveform-data.js likes to use a Web Worker, the AudioBuffer passed here is moved to the Worker's memory.
    // This means that the Spectrogram generator, which allocates a separate Uint8Array to avoid this problem, doesn't have
    // access to the buffer. As a hack, I'm duplicating the AudioBuffer before passing it to the constructor function

    b = cloneAudioBuffer(b);

    WaveformData.createFromAudio(
      {
        audio_buffer: b,
        scale: WAVEFORM_BASE_SAMPLES_PER_PIXEL,
        split_channels: true,
      },
      (err, waveformData) => {
        if (err) {
          setError(err);
        } else {
          data = waveformData;
          loading = false;
        }
      },
    );
  });

  $: if (data) {
    renderer.render(data, channel, $zoom, $pan).catch((e) => setError(e));
  }

  onMount(() => {
    renderer = new WaveformRenderer(getCanvas());
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
    <WaveformLoader />
  </div>
{/if}
