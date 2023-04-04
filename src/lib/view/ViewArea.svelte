<script lang="ts">
  import Controls from '$lib/view/Controls.svelte';
  import ViewFrame from './ViewFrame.svelte';
  import Ticker from './ticker/HorizontalTicker.svelte';
  import Waveform from './waveform/Waveform.svelte';
  import Spectrogram from './spectrogram/Spectrogram.svelte';
  import Playhead from './Playhead.svelte';
  import { HORIZONTAL_TICKER_PADDING } from '$lib/util/constants';
</script>

<div class="w-full flex flex-col overflow-y-auto overflow-x-hidden">
  <!--Top Markers-->
  <div class="flex-none basis-14">
    <Ticker />
  </div>

  <div class="relative h-full flex flex-col">
    <!--Waveform-->
    <ViewFrame title="waveform">
      <Waveform />
    </ViewFrame>

    <!--Spectrogram-->
    <ViewFrame title="spectrogram">
      <Spectrogram />
    </ViewFrame>

    <Playhead padding={HORIZONTAL_TICKER_PADDING} />
  </div>

  <Controls />
</div>
