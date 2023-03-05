<script lang="ts">
  import Controls from '$lib/view/Controls.svelte';
  import Frame from './Frame.svelte';
</script>

<div class="w-full flex flex-col overflow-y-auto">
  <!--Top Markers-->
  <div class="flex-none basis-12" />

  <!--Waveform-->
  <Frame title="waveform" />

  <!--Spectrogram-->
  <Frame title="spectrogram" />

  <Controls />
</div>
