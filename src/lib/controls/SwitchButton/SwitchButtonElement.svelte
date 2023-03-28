<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import shortid from 'shortid';
  import { readable, type Subscriber } from 'svelte/store';

  const button = shortid.generate();

  const { selectedOption }: any = getContext('__pyv_switch_button');

  export let value: string | undefined = undefined;

  let setSelected: Subscriber<boolean>;
  let selected = readable<boolean>(false, (set) => {
    setSelected = set;
  });

  selectedOption.subscribe((cur: any) => {
    setSelected(cur === (value ?? button));
  });

  $: setContext('__pyv_switch_button_element', {
    selected: selected,
  });
</script>

<button
  aria-selected={$selected}
  role="gridcell"
  class="outline-none flex items-center justify-center"
  on:click={() => selectedOption.set(value ?? button)}
>
  <slot />
</button>
