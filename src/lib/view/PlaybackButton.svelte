<script lang="ts">
  import IconPlay from '~icons/fa6-solid/play';
  import IconPause from '~icons/fa6-solid/pause';

  let paused = true;
</script>

<button
  class="w-16 h-16 flex items-center justify-center bg-teal-500 hover:bg-teal-400 text-white rounded-full shadow-highlight"
  on:click={() => (paused = !paused)}
>
  {#if paused}
    <IconPlay class="w-6 h-6" />
  {:else}
    <IconPause class="w-6 h-6" />
  {/if}
</button>
