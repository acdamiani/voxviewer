<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let value: string | undefined = undefined;
  export let rows = 3;
  export let background = true;
  export let gap: 'none' | 'gap' = 'none';

  let selectedOption = writable<string | undefined>(value);

  setContext('__pyv_switch_button', {
    selectedOption,
  });

  $: selectedOption.set(value);

  selectedOption.subscribe((v) => {
    value = v;
  });

  const backgroundStyle = background
    ? 'bg-neutral-50 dark:bg-neutral-950 rounded-lg p-2'
    : '';
  const gapStyle = gap === 'none' ? 'gap-0' : 'gap-2';
</script>

<div
  class="grid grid-flow-col auto-cols-fr {gapStyle} {backgroundStyle}"
  style="grid-template-rows: repeat({rows}, minmax(0, 1fr));"
  role="grid"
  aria-multiselectable="true"
>
  <slot />
</div>
