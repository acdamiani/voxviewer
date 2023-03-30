<script lang="ts">
  export let selected = false;

  $: selectedStyle = selected
    ? 'text-neutral-200 before:bg-teal-500'
    : 'text-neutral-400 before:bg-transparent';
</script>

<button
  class="relative flex items-center justify-center gap-2 outline-none text-lg font-bold px-2 py-1 transition-colors {selectedStyle} before:absolute before:-bottom-2 before:left-0 before:right-0 before:top-auto before:h-[3px] rounded-lg hover:bg-neutral-800 before:transition-colors before:rounded-full before:pointer-events-none"
  on:click
>
  <span class="text-base">
    <slot name="icon" />
  </span>
  <slot />
</button>
