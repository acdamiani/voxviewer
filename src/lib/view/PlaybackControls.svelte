<script>
  import { buffer, player } from '$lib/stores';
  import IconButton from '$lib/controls/IconButton.svelte';
  import IconStepBackwards from '~icons/fa6-solid/backward-step';
  import IconStepForwards from '~icons/fa6-solid/forward-step';
  import PlaybackButton from './PlaybackButton.svelte';

  let disabled = true;

  player.subscribe(($player) => {
    disabled = !$player;
  });
</script>

<div class="flex items-center gap-6">
  <IconButton
    icon={IconStepBackwards}
    {disabled}
    on:click={() => $player.seek(0)}
  />
  <PlaybackButton />
  <IconButton
    icon={IconStepForwards}
    {disabled}
    on:click={() => $player.seek($buffer.duration)}
  />
</div>
