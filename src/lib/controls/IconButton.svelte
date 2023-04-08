<script lang="ts">
  export let icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  export let disabled = false;
</script>

<button
  class="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white disabled:text-neutral-700"
  {disabled}
  on:click
>
  {#if icon}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}
</button>
