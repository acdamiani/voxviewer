<script lang="ts">
  import IconPlus from '~icons/octicon/plus-24';
  import IconAudio from '~icons/fa6-solid/headphones';

  let files: FileList | null;

  function readFile(e: Event) {
    const target = e?.target as HTMLInputElement;
    const file = target?.files?.[0];

    readFileResult?.(file);
  }

  export let readFileResult: ((file: File | undefined) => void) | undefined =
    undefined;
  export let accept: string | undefined = undefined;
  export let id: string | undefined = undefined;
</script>

<label for={id}>
  <!-- Test -->
  <div
    class="p-3 text-neutral-200 font-bold rounded-lg disabled:opacity-50 flex flex-col gap-2 items-center justify-center bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-base transition-colors cursor-pointer w-full"
  >
    <span class="text-2xl">
      {#if files?.[0]}
        <IconAudio />
      {:else}
        <IconPlus />
      {/if}
    </span>
    {#if files?.[0]}
      {files[0].name}
    {:else}
      Pick File
    {/if}
  </div>
  <input
    type="file"
    class="hidden"
    on:change={readFile}
    bind:files
    {accept}
    {id}
  />
</label>
