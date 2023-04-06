<script>
  import Checkbox from '$lib/controls/Checkbox.svelte';
  import DropdownButton from '$lib/controls/DropdownButton.svelte';
  import MultiButton from '$lib/controls/MultiButton.svelte';
  import Select from '$lib/controls/Select.svelte';
  import SmallButton from '$lib/controls/SmallButton.svelte';
  import OptionsSection from '$lib/OptionsSection.svelte';
  import { playerPosition } from '$lib/stores';
  import PlaybackControls from './PlaybackControls.svelte';
</script>

<div class="w-full flex gap-6 p-6 border-t border-neutral-800">
  <!--Spectrogram Info-->
  <div class="w-full flex flex-col gap-1 text-xs font-semibold justify-center">
    <span>File: 44000 Hz WAV</span>
    <span>Spectrogram Time: 1032 ms</span>
  </div>
  <PlaybackControls />
  <div class="w-full flex justify-end items-center">
    <div class="rounded-lg bg-neutral-900 border border-neutral-800 px-4">
      <span class="text-4xl font-mono">
        {$playerPosition.toFixed(2)}s
      </span>
    </div>
  </div>
</div>
