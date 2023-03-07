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

<label
  class="flex group outline-none rounded-lg h-8"
  tabindex="0"
  role="button"
>
  <input
    type="file"
    on:change={readFile}
    class="hidden"
    bind:files
    {accept}
    {id}
  />
  <div
    class="p-1 bg-slate-900 group-hover:bg-slate-700 text-white font-semibold h-8 px-3 rounded-l-lg flex items-center justify-center w-auto dark:bg-teal-500 dark:group-hover:bg-teal-400 outline-none fill-current gap-1 text-sm cursor-pointer"
  >
    <IconUpload />
    Upload
  </div>
  <div
    class="w-48 bg-transparent border border-slate-300 group-hover:border-slate-400 dark:border-gray-600 dark:group-hover:border-gray-500 rounded-r-lg outline-none dark:text-white px-2 h-8 whitespace-nowrap overflow-x-auto flex items-center cursor-pointer"
  >
    {#if files?.[0]}
      {files[0].name}
    {/if}
  </div>
</label>
