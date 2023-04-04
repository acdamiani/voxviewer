<script>
  import { player, playerPosition } from '$lib/stores';
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
  <span class="whitespace-nowrap text-xl font-mono"
    >{$playerPosition.toFixed(2)}s</span
  >
  <IconButton icon={IconStepBackwards} {disabled} />
  <PlaybackButton />
  <IconButton icon={IconStepForwards} {disabled} />
  <span class="whitespace-nowrap text-xl font-mono">00.00:00 s</span>
</div>
