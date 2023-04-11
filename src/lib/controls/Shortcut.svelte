<script lang="ts">
  export let keys: ('mouse-left' | 'mouse-middle' | 'mouse-right' | string)[] =
    [];
</script>

<div class="w-full flex justify-between items-center h-10">
  <span class="text-neutral-700 dark:text-neutral-300">
    <slot />
  </span>
  <div class="flex items-center">
    {#each keys as key, i}
      {#if key.startsWith('mouse-')}
        <div
          class="relative w-6 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-50 dark:border-neutral-950 overflow-hidden"
        >
          <div
            class="absolute flex inset-0 bottom-auto h-5 border-b-2 border-neutral-50 dark:border-neutral-950"
          >
            <div
              class="w-full h-full {key.substring(6) === 'left'
                ? 'bg-neutral-700 dark:bg-neutral-300'
                : 'bg-neutral-200 dark:bg-neutral-800'}"
            />
            <div
              class="flex-shrink-0 w-0.5 h-full bg-neutral-50 dark:bg-neutral-950"
            />
            <div
              class="w-full h-full {key.substring(6) === 'right'
                ? 'bg-neutral-700 dark:bg-neutral-300'
                : 'bg-neutral-200 dark:bg-neutral-800'}"
            />
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-3 rounded-full border-2 border-neutral-50 dark:border-neutral-950 {key.substring(
                6,
              ) === 'middle'
                ? 'bg-neutral-700 dark:bg-neutral-300'
                : 'bg-neutral-200 dark:bg-neutral-800'}"
            />
          </div>
        </div>
      {:else}
        <kbd
          class="px-2 py-0.5 bg-neutral-50 dark:bg-neutral-950 w-fit h-fit rounded-lg text-neutral-600 dark:text-neutral-400 font-mono border border-neutral-200 dark:border-neutral-800 text-sm"
        >
          {key}
        </kbd>
      {/if}
      <span class="text-xl">{i < keys.length - 1 ? '+' : ''}</span>
    {/each}
  </div>
</div>
