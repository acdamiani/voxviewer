<script lang="ts">
  import Controls from '$lib/view/Controls.svelte';
  import ViewFrame from './ViewFrame.svelte';
  import Ticker from './ticker/HorizontalTicker.svelte';
  import Waveform from './waveform/Waveform.svelte';
  import Spectrogram from './spectrogram/Spectrogram.svelte';
  import Playhead from './Playhead.svelte';

  let viewConfig: { view: 'waveform' | 'spectrogram'; channel: 0 | 1 }[] = [
    {
      view: 'waveform',
      channel: 0,
    },
    {
      view: 'spectrogram',
      channel: 0,
    },
  ];

  let inView = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="w-full flex flex-col"
  on:mouseenter={() => (inView = true)}
  on:mouseleave={() => (inView = false)}
>
  <!--Top Markers-->

  <div class="flex-none basis-14">
    <!-- Hacky hack -->
    <Ticker {inView} />
  </div>

  <div class="relative h-full flex flex-col">
    <!--Waveform-->
    <ViewFrame
      bind:view={viewConfig[0].view}
      bind:channel={viewConfig[0].channel}
    >
      {#if viewConfig[0].view === 'waveform'}
        <Waveform channel={viewConfig[0].channel} />
      {:else}
        <Spectrogram channel={viewConfig[0].channel} />
      {/if}
    </ViewFrame>

    <!--Spectrogram-->
    <ViewFrame
      bind:view={viewConfig[1].view}
      bind:channel={viewConfig[1].channel}
    >
      {#if viewConfig[1].view === 'waveform'}
        <Waveform channel={viewConfig[1].channel} />
      {:else}
        <Spectrogram channel={viewConfig[1].channel} />
      {/if}
    </ViewFrame>

    <Playhead />
  </div>

  <Controls />
</div>
