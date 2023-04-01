<script lang="ts">
  import IconSun from '~icons/octicon/sun-24';
  import IconMoon from '~icons/octicon/moon-24';
  import IconInfo from '~icons/octicon/info-24';
  import IconGithub from '~icons/octicon/mark-github-16';
  import NavbarButton from './NavbarButton.svelte';

  let dark = true;
</script>

<div
  class="relative p-2 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col items-center text-xl gap-2"
>
  <svg
    width="36"
    height="36"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="23" width="8" height="18" rx="4" fill="#FC8961" />
    <rect x="28" y="4" width="8" height="42" rx="4" fill="#FCFDBF" />
    <path
      d="M21 18V44.3431C21 45.404 21.4214 46.4214 22.1716 47.1716L29.1716 54.1716C30.7337 55.7337 33.2663 55.7337 34.8284 54.1716L41.8284 47.1716C42.5786 46.4214 43 45.404 43 44.3431V18"
      stroke="#FEC488"
      stroke-width="8"
      stroke-linecap="round"
    />
    <rect x="50" y="23" width="8" height="18" rx="4" fill="#FC8961" />
  </svg>

  <span class="absolute left-0 right-0 top-12 h-px bg-neutral-800" />

  <!-- <span class="inline-block -mt-px w-full h-px bg-neutral-800" /> -->

  <div class="flex flex-col h-full gap-2 justify-end">
    <NavbarButton on:click={() => (dark = !dark)}>
      {#if dark}
        <IconMoon />
      {:else}
        <IconSun />
      {/if}
    </NavbarButton>

    <NavbarButton>
      <IconInfo />
    </NavbarButton>

    <NavbarButton>
      <IconGithub />
    </NavbarButton>
  </div>
</div>
