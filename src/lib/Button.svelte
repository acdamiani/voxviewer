<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  export let disabled = false;
</script>

<button
  class="h-12 px-6 bg-teal-500 text-white font-bold text-lg rounded-lg w-fit disabled:opacity-50 hover:bg-teal-400 "
  on:click
  {disabled}
>
  <slot />
</button>
