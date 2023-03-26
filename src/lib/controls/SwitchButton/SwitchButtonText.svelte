<script lang="ts">
  import { getContext } from 'svelte';
  import shortid from 'shortid';

  const { selectedOption }: any = getContext('__pyv_switch_button');

  const button = shortid.generate();
  export let value: string | null = null;

  let selected = false;

  const selectedStyle = 'bg-neutral-800 text-white shadow-highlight';
  const notSelectedStyle = 'text-neutral-400';

  selectedOption.subscribe((cur: any) => {
    selected = cur === (value ?? button);
  });
</script>

<button
  aria-selected={selected}
  role="gridcell"
  class="outline-none flex flex-col items-center justify-center gap-1
  rounded-lg transition-colors p-2 {selected
    ? selectedStyle
    : notSelectedStyle}"
  on:click={() => selectedOption.set(value ?? button)}
  {value}
>
  <slot />
</button>
