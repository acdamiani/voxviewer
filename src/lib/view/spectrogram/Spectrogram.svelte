<script lang="ts">
  import { audio } from '$lib/stores';
  import { getContext } from 'svelte';
  import {
    generateSpectrogram,
    type SpectrogramOptions,
  } from './spectrogram-gen';

  const {
    setError,
  }: {
    setError: (err: Error | null) => void;
  } = getContext('__pyv_error');

  let buffer: AudioBuffer;

  $: if (buffer) {
    const options: SpectrogramOptions = {
      windowSize: 1024,
      zeroPaddingFactor: 1,
      windowFunction: 'hann',
    };

    console.log(generateSpectrogram(buffer, options));
  }

  audio.subscribe((a) => {
    if (!a) {
      return;
    }

    a.load()
      .then((b) => {
        buffer = b;
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  });
</script>

<div />
