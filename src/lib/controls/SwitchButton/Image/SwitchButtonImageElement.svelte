<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const { selected }: { selected: Readable<boolean> } = getContext(
    '__pyv_switch_button_element',
  );

  export let url: string | URL | undefined = undefined;

  let selectedStyle: string;

  $: selectedStyle = $selected ? 'ring-1' : 'ring-0';
</script>

<div class="w-full flex items-center justify-center">
  <span
    class="w-full rounded-md bg-cover aspect-[16/10] ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900 ring-neutral-950 dark:ring-neutral-50 transition-shadow {selectedStyle}"
    style="background-image: url({url});"
  />
</div>
