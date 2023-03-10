<script lang="ts">
  import shortid from 'shortid';

  import IconCheck from '~icons/octicon/check';

  let label = shortid.generate();
  let checked = false;
</script>

<div class="flex justify-between items-center">
  <label class="text-sm pointer" for={label}>
    <slot name="label">Check</slot>
  </label>
  <button
    class="outline-none ring-2 ring-transparent focus-visible:ring-teal-500 rounded-md"
    role="checkbox"
    aria-checked={checked}
    on:click={() => (checked = !checked)}
  >
    <input class="peer" type="checkbox" {checked} hidden id={label} />
    <div
      class="w-5 h-5 border-2 rounded-md border-zinc-800 peer-hover:border-zinc-700 hover:border-zinc-700 peer-checked:border-none peer-checked:bg-teal-500 flex items-center justify-center p-1 text-white"
    >
      {#if checked}
        <IconCheck class="" />
      {/if}
    </div>
  </button>
</div>
