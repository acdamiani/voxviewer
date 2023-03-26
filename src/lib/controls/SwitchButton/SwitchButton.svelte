<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let value: string | undefined = undefined;
  export let rows = 3;

  let selectedOption = writable<string | undefined>(value);

  setContext('__pyv_switch_button', {
    selectedOption,
  });

  $: selectedOption.set(value);

  selectedOption.subscribe((v) => {
    value = v;
  });
</script>

<div class="flex flex-col gap-2">
  <span
    class="font-semibold uppercase tracking-widest text-xs text-neutral-500"
  >
    <slot name="title" />
  </span>
  <div
    class="grid grid-flow-col auto-cols-fr gap-1 bg-black bg-opacity-30 rounded-lg p-2"
    style="grid-template-rows: repeat({rows}, minmax(0, 1fr));"
    role="grid"
    aria-multiselectable="true"
  >
    <slot />
  </div>
</div>
