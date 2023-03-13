<script lang="ts">
  import Controls from '$lib/view/Controls.svelte';
  import ViewFrame from './ViewFrame.svelte';
  import Ticker from './ticker/HorizontalTicker.svelte';
  import Waveform from './waveform/Waveform.svelte';
  import Spectrogram from './spectrogram/Spectrogram.svelte';
</script>

<div class="w-full flex flex-col overflow-y-auto">
  <!--Top Markers-->
  <div class="flex-none basis-14">
    <Ticker />
  </div>

  <!--Waveform-->
  <ViewFrame title="waveform">
    <Waveform />
  </ViewFrame>

  <!--Spectrogram-->
  <ViewFrame title="spectrogram">
    <Spectrogram />
  </ViewFrame>

  <Controls />
</div>
