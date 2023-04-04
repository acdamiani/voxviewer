<script lang="ts">
  import { player } from '$lib/stores';
  import IconPlay from '~icons/fa6-solid/play';
  import IconPause from '~icons/fa6-solid/pause';

  let paused = true;
  let disabled = true;

  const toggleState = () => {
    if (disabled || !$player) {
      return;
    }

    paused = !paused;

    if (paused) {
      $player.pause();
    } else {
      $player.play();
    }
  };

  player.subscribe(($player) => {
    disabled = !$player;
  });
</script>

<button
  class="w-16 h-16 flex items-center justify-center bg-teal-500 hover:bg-teal-400 text-neutral-100 rounded-full shadow-highlight disabled:bg-teal-800 disabled:text-neutral-500"
  on:click={toggleState}
  {disabled}
>
  {#if paused}
    <IconPlay class="w-6 h-6" />
  {:else}
    <IconPause class="w-6 h-6" />
  {/if}
</button>
