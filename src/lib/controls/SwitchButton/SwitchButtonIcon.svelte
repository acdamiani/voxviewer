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
  class="outline-none flex flex-col items-center justify-center min-w-[4rem] h-16 gap-1
  {selected ? selectedStyle : notSelectedStyle} rounded-lg transition-colors"
  on:click={() => selectedOption.set(value ?? button)}
  {value}
>
  <div
    class="flex relative rounded-lg border border-zinc-300 border-opacity-30 overflow-hidden px-0.5 pt-1"
  >
    <slot />
  </div>
  <span class="text-xs">
    <slot name="name" />
  </span>
</button>
