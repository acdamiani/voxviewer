<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const { selected }: { selected: Readable<boolean> } = getContext(
    '__vv_switch_button_element',
  );

  let selectedStyle: string;

  $: selectedStyle = $selected
    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-md shadow-black/25'
    : 'text-neutral-600 dark:text-neutral-400';
</script>

<div
  class="w-full rounded-lg transition-colors {selectedStyle} flex flex-col items-center justify-center h-16 gap-1"
>
  <div
    class="flex relative rounded-lg border border-neutral-500 dark:border-neutral-500 border-opacity-30 overflow-hidden px-0.5 pt-1"
  >
    <slot />
  </div>
  <span class="text-xs">
    <slot name="name" />
  </span>
</div>
