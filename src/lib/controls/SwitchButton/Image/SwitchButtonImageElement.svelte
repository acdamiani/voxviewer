<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  const { selected }: { selected: Readable<boolean> } = getContext(
    '__pyv_switch_button_element',
  );

  export let url: string | URL | undefined = undefined;

  let selectedStyle: string;

  $: selectedStyle = $selected ? 'ring-opacity-100' : 'ring-opacity-0';
</script>

<div class="w-full flex items-center justify-center">
  <span
    class="w-full rounded-md bg-cover aspect-[16/10] ring-1 ring-offset-2 ring-offset-zinc-900 ring-white transition-shadow {selectedStyle}"
    style="background-image: url({url});"
  />
</div>
