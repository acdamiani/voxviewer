<script lang="ts">
  import IconGithub from '~icons/octicon/mark-github-16';
  import IconLinkedin from '~icons/fa6-brands/linkedin';

  import IconSun from '~icons/octicon/sun-24';
  import IconMoon from '~icons/octicon/moon-24';
  import IconQuestion from '~icons/octicon/question-24';
  import NavbarButton from './NavbarButton.svelte';
  import Modal from '../Modal.svelte';
  import Profile from '$lib/assets/profile.png';
  import Signature from '$lib/assets/signature.png';
  import Shortcut from '$lib/controls/Shortcut.svelte';
  import { onMount } from 'svelte';

  let infoModal = false;
  let commandModal = false;

  let dark = false;
  onMount(() => {
    dark = document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const currentTheme = !document.documentElement.classList.contains(`dark`);
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`);

    localStorage.setItem(
      `color-theme`,
      prefersDark.matches === currentTheme
        ? `auto`
        : currentTheme
        ? `dark`
        : `light`,
    );

    if (currentTheme) document.documentElement.classList.add(`dark`);
    else document.documentElement.classList.remove(`dark`);

    dark = currentTheme;
  };
</script>

<div
  class="relative p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-xl gap-2"
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

  <span
    class="absolute left-0 right-0 top-12 h-px bg-neutral-200 dark:bg-neutral-800"
  />

  <!-- <span class="inline-block -mt-px w-full h-px bg-neutral-800" /> -->

  <div class="flex flex-col h-full gap-2 justify-end">
    <NavbarButton on:click={toggleTheme}>
      {#if dark}
        <IconMoon />
      {:else}
        <IconSun />
      {/if}
    </NavbarButton>

    <NavbarButton on:click={() => (commandModal = !commandModal)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.94379 21.9906C5.22561 21.9906 4.56674 21.8158 3.96721 21.466C3.36768 21.1101 2.88993 20.6323 2.53396 20.0328C2.17799 19.4333 2 18.7713 2 18.0468C2 17.3162 2.17799 16.6542 2.53396 16.0609C2.88993 15.4614 3.36768 14.9836 3.96721 14.6276C4.56674 14.2654 5.22561 14.0843 5.94379 14.0843H8.4356V9.88759H5.94379C5.22561 9.88759 4.56674 9.71272 3.96721 9.363C3.36768 9.00703 2.88993 8.52928 2.53396 7.92974C2.17799 7.33021 2 6.66823 2 5.94379C2 5.21311 2.17799 4.55113 2.53396 3.95785C2.88993 3.35831 3.36768 2.88368 3.96721 2.53396C4.56674 2.17799 5.22561 2 5.94379 2C6.67447 2 7.33958 2.17799 7.93911 2.53396C8.53864 2.88368 9.01639 3.35831 9.37237 3.95785C9.72834 4.55113 9.90632 5.21311 9.90632 5.94379V8.41686H14.103V5.94379C14.103 5.21311 14.281 4.55113 14.637 3.95785C14.993 3.35831 15.4676 2.88368 16.0609 2.53396C16.6604 2.17799 17.3224 2 18.0468 2C18.7775 2 19.4395 2.17799 20.0328 2.53396C20.6323 2.88368 21.1101 3.35831 21.466 3.95785C21.822 4.55113 22 5.21311 22 5.94379C22 6.66823 21.822 7.33021 21.466 7.92974C21.1101 8.52928 20.6323 9.00703 20.0328 9.363C19.4395 9.71272 18.7775 9.88759 18.0468 9.88759H15.5738V14.0843H18.0468C18.7775 14.0843 19.4395 14.2654 20.0328 14.6276C20.6323 14.9836 21.1101 15.4614 21.466 16.0609C21.822 16.6542 22 17.3162 22 18.0468C22 18.7713 21.822 19.4333 21.466 20.0328C21.1101 20.6323 20.6323 21.1101 20.0328 21.466C19.4395 21.8158 18.7775 21.9906 18.0468 21.9906C17.3224 21.9906 16.6604 21.8158 16.0609 21.466C15.4676 21.1101 14.993 20.6323 14.637 20.0328C14.281 19.4333 14.103 18.7713 14.103 18.0468V15.5644H9.90632V18.0468C9.90632 18.7713 9.72834 19.4333 9.37237 20.0328C9.01639 20.6323 8.53864 21.1101 7.93911 21.466C7.33958 21.8158 6.67447 21.9906 5.94379 21.9906ZM5.94379 20.5199C6.40593 20.5199 6.82436 20.4106 7.19906 20.192C7.57377 19.9672 7.87354 19.6674 8.09836 19.2927C8.32319 18.9118 8.4356 18.4965 8.4356 18.0468V15.5644H5.94379C5.49415 15.5644 5.08197 15.6768 4.70726 15.9016C4.33255 16.1265 4.03279 16.4262 3.80796 16.8009C3.58314 17.1756 3.47073 17.5909 3.47073 18.0468C3.47073 18.4965 3.58314 18.9118 3.80796 19.2927C4.03279 19.6674 4.33255 19.9672 4.70726 20.192C5.08197 20.4106 5.49415 20.5199 5.94379 20.5199ZM5.94379 8.41686H8.4356V5.94379C8.4356 5.4879 8.32319 5.0726 8.09836 4.69789C7.87354 4.32318 7.57377 4.02654 7.19906 3.80796C6.82436 3.58314 6.40593 3.47073 5.94379 3.47073C5.49415 3.47073 5.08197 3.58314 4.70726 3.80796C4.33255 4.02654 4.03279 4.32318 3.80796 4.69789C3.58314 5.0726 3.47073 5.4879 3.47073 5.94379C3.47073 6.39969 3.58314 6.81499 3.80796 7.1897C4.03279 7.5644 4.33255 7.86417 4.70726 8.08899C5.08197 8.30757 5.49415 8.41686 5.94379 8.41686ZM15.5738 8.41686H18.0468C18.509 8.41686 18.9243 8.30757 19.2927 8.08899C19.6674 7.86417 19.9641 7.5644 20.1827 7.1897C20.4075 6.81499 20.5199 6.39969 20.5199 5.94379C20.5199 5.4879 20.4075 5.0726 20.1827 4.69789C19.9641 4.32318 19.6674 4.02654 19.2927 3.80796C18.9243 3.58314 18.509 3.47073 18.0468 3.47073C17.5909 3.47073 17.1756 3.58314 16.8009 3.80796C16.4262 4.02654 16.1265 4.32318 15.9016 4.69789C15.6831 5.0726 15.5738 5.4879 15.5738 5.94379V8.41686ZM18.0468 20.5199C18.509 20.5199 18.9243 20.4106 19.2927 20.192C19.6674 19.9672 19.9641 19.6674 20.1827 19.2927C20.4075 18.9118 20.5199 18.4965 20.5199 18.0468C20.5199 17.5909 20.4075 17.1756 20.1827 16.8009C19.9641 16.4262 19.6674 16.1265 19.2927 15.9016C18.9243 15.6768 18.509 15.5644 18.0468 15.5644H15.5738V18.0468C15.5738 18.4965 15.6831 18.9118 15.9016 19.2927C16.1265 19.6674 16.4262 19.9672 16.8009 20.192C17.1756 20.4106 17.5909 20.5199 18.0468 20.5199ZM9.90632 14.0843H14.103V9.88759H9.90632V14.0843Z"
          fill="currentColor"
        />
      </svg>
    </NavbarButton>

    <NavbarButton on:click={() => (infoModal = !infoModal)}>
      <IconQuestion />
    </NavbarButton>
  </div>
</div>

<Modal bind:open={infoModal}>
  <span slot="title">About</span>
  <div
    class="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4"
  >
    <span class="text-xl text-neutral-950 dark:text-neutral-50 font-semibold"
      >The Project</span
    >
    <p class="text-neutral-600 dark:text-neutral-400">
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
      class="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 flex items-center justify-center gap-0.5"
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
        <span class="text-3xl text-neutral-950 dark:text-neutral-50 font-bold"
          >vox</span
        >
        <span class="text-3xl text-neutral-950 dark:text-neutral-50"
          >viewer</span
        >
      </span>
    </div>
    <div
      class="w-fit flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4"
    >
      <span class="text-xl text-neutral-950 dark:text-neutral-50 font-semibold"
        >Made with ❤️</span
      >
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
          class="rounded-full invert dark:invert-0"
          src={Signature}
          alt="profile"
          width="92.25"
          height="66"
        />
      </div>
    </div>
  </div>
  <div class="grid grid-rows-1 grid-cols-2 gap-2">
    <a
      class="bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 flex flex-col hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      href="https://github.com/acdamiani/voxviewer"
    >
      <span class="text-xl text-neutral-950 dark:text-neutral-50 font-semibold"
        >Github</span
      >
      <p>Check out the source code for the project</p>
      <span class="self-end text-2xl text-neutral-950 dark:text-neutral-50">
        <IconGithub />
      </span>
    </a>
    <a
      href="https://www.linkedin.com/in/augustdamiani/"
      class="bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 flex flex-col hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
    >
      <span class="text-xl text-neutral-950 dark:text-neutral-50 font-semibold"
        >LinkedIn</span
      >
      <p>If you'd like to connect with me</p>
      <span class="self-end text-2xl text-neutral-950 dark:text-neutral-50">
        <IconLinkedin width="1em" height="1em" />
      </span>
    </a>
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
