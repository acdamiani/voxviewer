<script lang="ts">
  import shortid from 'shortid';

  import IconCheck from '~icons/octicon/check';

  export let defaultChecked = false;

  let label = shortid.generate();
  let checked = defaultChecked;
</script>

<div class="flex justify-between items-center">
  <label class="text-sm pointer" for={label}>
    <slot name="label">Check</slot>
  </label>
  <div class="flex flex-1 max-w-[12rem]">
    <button
      class="outline-none ring-2 ring-transparent focus-visible:ring-teal-500 rounded-md shadow-highlight"
      role="checkbox"
      aria-checked={checked}
      on:click={() => (checked = !checked)}
    >
      <input class="peer" type="checkbox" {checked} hidden id={label} />
      <div
        class="w-5 h-5 border-2 rounded-md border-neutral-800 peer-checked:border-none peer-checked:bg-teal-500 flex items-center justify-center p-1 text-white"
      >
        {#if checked}
          <IconCheck class="" />
        {/if}
      </div>
    </button>
  </div>
</div>
