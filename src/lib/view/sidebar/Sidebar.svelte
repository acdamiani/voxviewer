<script lang="ts">
  import Settings from './Settings.svelte';
  import SidebarTabButton from './SidebarTabButton.svelte';

  import IconGear from '~icons/octicon/gear-16';
  import IconExport from '~icons/octicon/file-symlink-file-16';
  import { onMount } from 'svelte';

  let selected: 'settings' | 'export' = 'settings';
  let scrollElement: HTMLDivElement;
  let scrolled = false;
  $: borderStyle = scrolled ? 'border-neutral-800' : 'border-neutral-900';

  onMount(() => {
    scrollElement.addEventListener('scroll', () => {
      scrolled = scrollElement.scrollTop > 0;
    });
  });
</script>

<div
  class="relative flex flex-col w-[21rem] rounded-xl bg-neutral-900 overflow-y-auto scrollbar-hide shadow-lg border border-neutral-800 h-full"
  bind:this={scrollElement}
>
  <div
    class="flex min-h-[49px] items-center sticky top-0 rounded-lg rounded-b-none gap-2 justify-around z-20 px-4 bg-neutral-900 border-b transition-colors {borderStyle}"
  >
    <SidebarTabButton
      selected={selected === 'settings'}
      on:click={() => (selected = 'settings')}
    >
      <IconGear slot="icon" />
      Settings</SidebarTabButton
    >
    <SidebarTabButton
      selected={selected === 'export'}
      on:click={() => (selected = 'export')}
    >
      <IconExport slot="icon" />
      Export</SidebarTabButton
    >
  </div>
  <div class="p-4">
    {#if selected === 'settings'}
      <Settings />
    {:else if selected === 'export'}
      <div />
    {/if}
  </div>
</div>
