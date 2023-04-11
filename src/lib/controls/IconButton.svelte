<script lang="ts">
  export let icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  export let disabled = false;
</script>

<button
  class="w-6 h-6 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50 disabled:text-neutral-300 dark:disabled:text-neutral-700"
  {disabled}
  on:click
>
  {#if icon}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}
</button>
