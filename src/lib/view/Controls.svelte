<script>
  import Checkbox from '$lib/controls/Checkbox.svelte';
  import DropdownButton from '$lib/controls/DropdownButton.svelte';
  import MultiButton from '$lib/controls/MultiButton.svelte';
  import Select from '$lib/controls/Select.svelte';
  import SmallButton from '$lib/controls/SmallButton.svelte';
  import OptionsSection from '$lib/OptionsSection.svelte';
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
    <DropdownButton>
      <span slot="button">Save</span>
      <OptionsSection>
        <span slot="title">Waveform</span>
      </OptionsSection>
      <OptionsSection>
        <span slot="title">Spectrogram</span>
      </OptionsSection>
    </DropdownButton>
  </div>
</div>
