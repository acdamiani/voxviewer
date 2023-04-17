<script>
  import { playerPosition } from '$lib/stores';
  import PlaybackControls from './PlaybackControls.svelte';
</script>

<div
  class="w-full flex gap-6 p-6 border-t border-neutral-200 dark:border-neutral-800"
>
  <!--Spectrogram Info-->
  <div
    class="w-full flex flex-col gap-1 text-xs font-semibold justify-center"
  />
  <PlaybackControls />
  <div class="w-full flex justify-end items-center">
    <div
      class="rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4"
    >
      <span class="text-4xl font-mono">
        {$playerPosition.toFixed(2)}s
      </span>
    </div>
  </div>
</div>
