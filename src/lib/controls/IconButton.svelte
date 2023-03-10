<script lang="ts">
  export let icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
</script>

<button class="w-6 h-6 flex items-center justify-center hover:text-white">
  {#if icon}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}
</button>
