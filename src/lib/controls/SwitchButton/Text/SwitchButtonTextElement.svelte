<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const { selected }: { selected: Readable<boolean> } = getContext(
    '__vv_switch_button_element',
  );

  let selectedStyle: string;

  $: selectedStyle = $selected
    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-md shadow-neutral-950/25'
    : 'text-neutral-600 dark:text-neutral-400';
</script>

<div class="w-full rounded-lg transition-colors p-2 {selectedStyle}">
  <slot />
</div>
