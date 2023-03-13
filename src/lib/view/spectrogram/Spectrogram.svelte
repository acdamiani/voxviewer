<script lang="ts">
  import { audio } from '$lib/stores';
  import { getContext } from 'svelte';

  const {
    setError,
  }: {
    setError: (err: Error | null) => void;
  } = getContext('__pyv_error');

  let buffer: AudioBuffer;

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
