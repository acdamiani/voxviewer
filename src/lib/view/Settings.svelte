<script lang="ts">
  import { audio } from '$lib/stores';

  import Button from '$lib/controls/Button.svelte';
  import FileInput from '$lib/controls/FileInput.svelte';
  import AudioFile from '$lib/audio/audio';
  import Checkbox from '$lib/controls/Checkbox.svelte';
  import Select from '$lib/controls/Select.svelte';

  let file: File | undefined = undefined;
  let audioFile: AudioFile | null = null;

  audio.subscribe((a) => {
    audioFile = a;
  });

  const loadFile = () => {
    if (!file) {
      return;
    }

    if (audioFile?.blob !== file) {
      audio.set(new AudioFile(file));
    }
  };
</script>

<div
  class="flex-none basis-96 border-r-2 border-zinc-800 flex flex-col p-4 gap-1"
>
  <h2 class="font-bold text-lg">Settings</h2>
  <FileInput readFileResult={(f) => (file = f)} accept="audio/*" />
  <Select>
    <span slot="label">Window function</span>
    <option>Rectangular</option>
    <option>Welch</option>
    <option>Hamming</option>
    <option selected>Hann</option>
    <option>Blackman-Harris</option>
  </Select>
  <Select>
    <span slot="label">Window size</span>
    <option>128</option>
    <option>256</option>
    <option>512</option>
    <option selected>1024</option>
    <option>2048</option>
    <option>4096</option>
    <option>8192</option>
  </Select>
  <Select>
    <span slot="label">Zero padding factor</span>
    <option selected>1</option>
    <option>2</option>
    <option>4</option>
    <option>8</option>
    <option>16</option>
    <option>32</option>
  </Select>
  <Checkbox defaultChecked={true}>
    <span slot="label">Overlap</span>
  </Checkbox>
  <Button disabled={!file} on:click={loadFile}>Load</Button>
</div>
