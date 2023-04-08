<script lang="ts">
  import IconSun from '~icons/octicon/sun-24';
  import IconMoon from '~icons/octicon/moon-24';
  import IconQuestion from '~icons/octicon/question-24';
  import NavbarButton from './NavbarButton.svelte';
  import Modal from '../Modal.svelte';
  import Profile from '$lib/assets/profile.png';
  import Signature from '$lib/assets/signature.png';
  import Shortcut from '$lib/controls/Shortcut.svelte';

  let dark = true;
  let infoModal = false;
  let commandModal = false;
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

    <!-- <a href="https://github.com/acdamiani/peekyourvoice"> -->
    <!--   <NavbarButton> -->
    <!--     <IconGithub class="text-2xl" /> -->
    <!--   </NavbarButton> -->
    <!-- </a> -->

    <NavbarButton on:click={() => (commandModal = !commandModal)}>
      <span class="text-4xl leading-none">⌘</span>
    </NavbarButton>

    <NavbarButton on:click={() => (infoModal = !infoModal)}>
      <IconQuestion />
    </NavbarButton>
  </div>
</div>

<Modal bind:open={infoModal}>
  <span slot="title">About</span>
  <div class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4">
    <span class="text-xl text-neutral-50 font-semibold">The Project</span>
    <p class="text-neutral-400">
      A project for the 2023 <a
        href="https://hack.sveltesociety.dev/"
        class="text-teal-500 hover:text-teal-400 transition-colors"
        >SvelteHack</a
      > competition. An experiment with WebAssembly, Rust, and Web Workers, this
      app takes given audio information and converts it into a dual waveform-spectrogram
      visual representation.
    </p>
  </div>
  <div class="w-full flex gap-2">
    <div
      class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex items-center justify-center gap-0.5"
    >
      <svg
        width="64"
        height="64"
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
      <div />
      <span class="flex">
        <span class="text-3xl text-neutral-50 font-bold">vox</span>
        <span class="text-3xl text-neutral-50">viewer</span>
      </span>
    </div>
    <div
      class="w-fit flex-shrink-0 bg-neutral-800 border border-neutral-700 rounded-lg p-4"
    >
      <span class="text-xl text-neutral-50 font-semibold">Made with ❤️</span>
      <div class="mt-4 flex w-full items-center gap-4 justify-center">
        <a
          class="scale-100 hover:scale-105 transition-transform"
          href="https://github.com/acdamiani"
        >
          <img
            class="w-[65px] h-[65px] rounded-full"
            src={Profile}
            alt="profile"
            width="65"
            height="65"
          />
        </a>

        <img
          class="rounded-full"
          src={Signature}
          alt="profile"
          width="92.25"
          height="66"
        />
      </div>
    </div>
  </div>
</Modal>

<Modal bind:open={commandModal}>
  <span slot="title">Commands</span>
  <div class="flex flex-col min-w-[24rem]">
    <Shortcut keys={['Ctrl', 'mouse-middle']}>Zoom (Scroll)</Shortcut>
    <Shortcut keys={['Ctrl', '-']}>Zoom In</Shortcut>
    <Shortcut keys={['Ctrl', '=']}>Zoom Out</Shortcut>
    <Shortcut keys={['mouse-middle']}>Pan</Shortcut>
    <Shortcut keys={['a']}>Pan Left</Shortcut>
    <Shortcut keys={['d']}>Pan Right</Shortcut>
    <Shortcut keys={['←']}>Pan Left</Shortcut>
    <Shortcut keys={['→']}>Pan Right</Shortcut>
    <Shortcut keys={['Space']}>Play/Pause</Shortcut>
    <Shortcut keys={['Home']}>Skip to Start</Shortcut>
    <Shortcut keys={['End']}>Skip to End</Shortcut>
  </div>
</Modal>
