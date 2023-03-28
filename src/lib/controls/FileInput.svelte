<script lang="ts">
  import IconUpload from '~icons/octicon/upload-16';

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

<button
  class="flex-shrink-0 rounded-lg outline-none appearance-none ring-2 ring-transparent focus-visible:ring-teal-500"
>
  <label class="flex group outline-none rounded-lg">
    <input
      type="file"
      class="hidden"
      on:change={readFile}
      bind:files
      {accept}
      {id}
    />
    <div
      class="p-1 text-white font-semibold h-8 px-3 rounded-l-lg flex items-center justify-center bg-teal-500 group-hover:bg-teal-400 outline-none fill-current gap-1 text-sm cursor-pointer whitespace-nowrap"
    >
      <IconUpload />
      Pick File
    </div>
    <div
      class="w-full bg-transparent border-2 border-l-0 border-zinc-800 group-hover:border-zinc-700 rounded-r-lg outline-none text-white px-2 h-8 whitespace-nowrap overflow-x-auto flex items-center cursor-pointer scrollbar-hide"
    >
      {#if files?.[0]}
        {files[0].name}
      {/if}
    </div>
  </label>
</button>
