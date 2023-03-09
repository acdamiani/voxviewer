<script lang="ts">
  import { fade } from 'svelte/transition';

  import IconChevronUp from '~icons/octicon/chevron-up';

  let toggled = false;

  let content: HTMLDivElement;
  let button: HTMLButtonElement;

  let top: number, left: number;

  $: if (toggled && button && content) {
    const buttonRect = button.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    top = buttonRect.top - contentRect.height - 8;
    left = buttonRect.left + (buttonRect.width - contentRect.width);
  }
</script>

{#if toggled}
  <div
    class="fixed flex flex-col p-3 bg-zinc-900 border-2 rounded-lg border-zinc-700 gap-2"
    style="top: {top}px; left: {left}px;"
    in:fade={{ duration: 50 }}
    out:fade={{ duration: 150 }}
    bind:this={content}
  >
    <slot />
  </div>
{/if}

<svelte:window
  on:click={() => {
    toggled = false;
  }}
/>

<button
  class="h-12 px-6 bg-teal-500 border-2 border-transparent text-white font-bold text-lg rounded-lg w-fit disabled:opacity-50 enabled:hover:border-teal-500 enabled:hover:bg-transparent transition-colors"
  on:click|stopPropagation={() => (toggled = !toggled)}
  bind:this={button}
>
  <div class="flex items-center gap-1">
    <slot name="button">Click</slot>
    <IconChevronUp />
  </div>
</button>
