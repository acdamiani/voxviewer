<script lang="ts">
  import Settings from './Settings.svelte';

  import { onMount } from 'svelte';

  let scrollElement: HTMLDivElement;
  let scrolled = false;
  $: borderStyle = scrolled
    ? 'border-neutral-200 dark:border-neutral-800'
    : 'border-neutral-100 dark:border-neutral-900';

  onMount(() => {
    scrollElement.addEventListener('scroll', () => {
      scrolled = scrollElement.scrollTop > 0;
    });
  });
</script>

<div
  class="grid grid-rows-[auto_minmax(0,1fr)] w-[21rem] z-20 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
  bind:this={scrollElement}
>
  <div
    class="rounded-lg rounded-b-none z-20 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b transition-colors {borderStyle}"
  >
    <span class="text-xl font-semibold text-neutral-950 dark:text-neutral-50"
      >Settings</span
    >
  </div>
  <div class="p-4 overflow-scroll">
    <Settings />
  </div>
</div>
