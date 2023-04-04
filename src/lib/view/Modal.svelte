<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import IconClose from '~icons/octicon/x-16';

  const onKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      open = false;
    }
  };

  export let open = false;
</script>

<svelte:window on:keydown={onKeypress} />

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="fixed flex z-50 inset-0 bg-neutral-900 bg-opacity-25 items-center justify-center"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
    on:click={() => (open = false)}
  >
    <div
      class="relative max-w-xl bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-4"
      on:click|stopPropagation
      in:scale={{ duration: 250, delay: 50 }}
    >
      <div class="flex mb-4">
        <span class="text-xl font-semibold text-neutral-50">
          <slot name="title" />
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <slot />
      </div>
      <button
        class="outline-none absolute top-2 right-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors p-1 cursor-pointer text-base"
        on:click={() => (open = false)}
      >
        <IconClose />
      </button>
    </div>
  </div>
{/if}
