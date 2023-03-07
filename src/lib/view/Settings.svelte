<script lang="ts">
  import { audio } from '$lib/stores';

  import Button from '$lib/Button.svelte';
  import FileInput from '$lib/FileInput.svelte';
  import AudioFile from '$lib/audio/audio';

  let file: File | undefined = undefined;
  let audioFile: AudioFile | null = null;

  audio.subscribe((a) => {
    audioFile = a;
  });

  const loadFile = () => {
    if (!file) {
      return;
    }

    if (audioFile?.blob === file) {
      audio.update((a) => a);
    } else {
      audio.set(new AudioFile(file));
    }
  };
</script>

<div
  class="flex-none basis-96 border-r-2 border-zinc-800 flex flex-col p-4 gap-2"
>
  <h2 class="font-bold text-lg">Settings</h2>
  <FileInput readFileResult={(f) => (file = f)} />
  <Button disabled={!file} on:click={loadFile}>Load</Button>
</div>
