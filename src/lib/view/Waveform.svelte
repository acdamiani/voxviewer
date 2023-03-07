<script lang="ts">
  import Loader from '$lib/Loader.svelte';

  import { audio } from '$lib/stores';
  import { getContext, onMount } from 'svelte';

  const context: any = getContext('canvas');

  let loading = false;

  audio.subscribe((a) => {
    if (!a) {
      return;
    }

    loading = true;

    a.load().then(() => {
      loading = false;
    });
  });
</script>

{#if loading}
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader />
  </div>
{/if}
