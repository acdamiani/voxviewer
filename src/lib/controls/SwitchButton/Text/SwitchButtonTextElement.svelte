<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const { selected }: { selected: Readable<boolean> } = getContext(
    '__pyv_switch_button_element',
  );

  let selectedStyle: string;

  $: selectedStyle = $selected
    ? 'bg-neutral-800 text-white shadow-highlight'
    : 'text-neutral-400';
</script>

<div class="w-full rounded-lg transition-colors p-2 {selectedStyle}">
  <slot />
</div>
