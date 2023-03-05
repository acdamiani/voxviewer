<script>
  import Button from '$lib/Button.svelte';
  import PlaybackControls from './PlaybackControls.svelte';
</script>

<div class="w-full flex gap-6 p-6 border-t-2 border-zinc-800">
  <!--Spectrogram Info-->
  <div class="w-full flex flex-col gap-1 text-xs font-semibold justify-center">
    <span>File: 44000 Hz WAV</span>
    <span>Spectrogram Time: 1032 ms</span>
  </div>
  <PlaybackControls />
  <div class="w-full flex justify-end items-center">
    <Button>Save</Button>
  </div>
</div>
