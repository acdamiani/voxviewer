<script lang="ts">
  export let secondary = false;
  export let disabled = false;

  $: backgroundStyle = secondary
    ? 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 enabled:hover:bg-neutral-200 dark:enabled:hover:bg-neutral-800 text-base'
    : 'bg-teal-500 enabled:hover:bg-teal-400 shadow-highlight text-lg';
</script>

<button
  class="outline-none h-12 px-3 text-neutral-950 dark:text-neutral-50 font-bold rounded-lg disabled:opacity-50 flex gap-2 items-center justify-start {backgroundStyle} transition-colors min-w-max"
  on:click
  {disabled}
>
  {#if $$slots.icon}
    <span class="text-base">
      <slot name="icon" />
    </span>
  {/if}
  <slot />
</button>
