<script lang="ts">
  import Controls from '$lib/view/Controls.svelte';
  import Frame from './Frame.svelte';
  import Ticker from './ticker/HorizontalTicker.svelte';
</script>

<div class="w-full flex flex-col overflow-y-auto">
  <!--Top Markers-->
  <div class="flex-none basis-12">
    <Ticker />
  </div>

  <!--Waveform-->
  <Frame title="waveform" />

  <!--Spectrogram-->
  <Frame title="spectrogram" />

  <Controls />
</div>
