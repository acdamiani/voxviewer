<script lang="ts">
  import shortid from 'shortid';
  import IconChevronDown from '~icons/octicon/chevron-down';

  const label = shortid.generate();

  export let value: string | undefined = undefined;
</script>

<div class="flex w-full items-center justify-between">
  <label class="text-sm" for={label}>
    <slot name="label">Select</slot>
  </label>
  <div class="flex-1 relative max-w-[12rem]">
    <select
      class="w-full outline-none cursor-pointer p-2 pr-6 appearance-none bg-neutral-800 rounded-md ring-2 ring-transparent focus-visible:ring-teal-500 shadow-highlight transition-colors text-white"
      id={label}
      bind:value
    >
      <slot />
    </select>
    <IconChevronDown
      class="absolute top-1/2 right-1 -translate-y-1/2 pointer-events-none"
    />
  </div>
</div>
