<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let name = '';
  export let value = 0;
  export let min = 0;
  export let max = 10;
  export let step = 1;

  export let minLabel: string | undefined = undefined;
  export let maxLabel: string | undefined = undefined;

  export let displayValue: (value: number) => any = (v) => v.toString();

  let track: HTMLSpanElement;
  let left: number;
  let range: number;

  let dragging = false;

  const dispatcher = createEventDispatcher();

  $: left = (value - min) / range;
  $: range = max - min;
  $: value = Math.max(min, Math.min(max, value));
  $: dispatcher('change', value);

  const click = (e: MouseEvent) => {
    dragging = true;
    change(e);
    dragging = false;
  };

  const change = (e: MouseEvent) => {
    if (!dragging) {
      return;
    }

    const { left, width } = track.getBoundingClientRect();
    const offset = e.clientX - left;

    let next = min + Math.round((range * offset) / width / step) * step;
    next = Math.max(min, Math.min(max, next));

    value = next;
  };
</script>

<svelte:window on:mouseup={() => (dragging = false)} on:mousemove={change} />

<div class="flex gap-4 items-center pb-4">
  <span class="text-sm text-neutral-600 dark:text-neutral-400">
    {minLabel ?? min}
  </span>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span
    class="cursor-pointer relative inline-block box-content h-1 py-6 w-full"
    on:mousedown={() => (dragging = true)}
    on:click={click}
  >
    <span
      class="block h-1 rounded-lg bg-neutral-50 dark:bg-neutral-950 w-full"
      bind:this={track}
    />
    <span
      class="absolute left-0 top-1/2 block h-1 rounded-lg bg-neutral-400 dark:bg-neutral-600 w-full origin-left -translate-y-1/2"
      style="width: {left * 100}%;"
    />
    <div
      class="absolute left-0 top-1/2 h-6 w-3 rounded-lg bg-neutral-300 dark:bg-neutral-700 -translate-y-1/2 -translate-x-1/2 shadow-lg shadow-neutral-950/50"
      style="left: {left * 100}%;"
    >
      <input type="hidden" {min} {max} {step} {value} {name} />
      <span
        class="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-neutral-200 dark:bg-neutral-950 rounded-md px-2 text-neutral-600 dark:text-neutral-400"
        >{displayValue(value)}</span
      >
    </div>
  </span>
  <span class="text-sm text-neutral-600 dark:text-neutral-400">
    {maxLabel ?? max}
  </span>
</div>
