<script>
  import Checkbox from '$lib/controls/Checkbox.svelte';
  import DropdownButton from '$lib/controls/DropdownButton.svelte';
  import MultiButton from '$lib/controls/MultiButton.svelte';
  import SmallButton from '$lib/controls/SmallButton.svelte';
  import OptionsSection from '$lib/OptionsSection.svelte';
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
    <DropdownButton>
      <span slot="button">Save</span>
      <OptionsSection>
        <span slot="title">Waveform</span>
        <Checkbox>
          <span slot="label">Full view</span>
        </Checkbox>
        <MultiButton>
          <span slot="label">Download</span>
          <SmallButton>svg</SmallButton>
          <SmallButton>png</SmallButton>
          <SmallButton>jpg</SmallButton>
        </MultiButton>
      </OptionsSection>
      <OptionsSection>
        <span slot="title">Spectrogram</span>
      </OptionsSection>
    </DropdownButton>
  </div>
</div>
