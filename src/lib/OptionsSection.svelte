<div class="bg-inherit">
  <div class="bg-inherit relative w-64 border-2 rounded-lg border-zinc-800">
    <div class="absolute top-0 left-2 -translate-y-1/2 bg-inherit px-2 flex">
      <span class="uppercase font-semibold tracking-widest leading-none text-xs"
        ><slot name="title" /></span
      >
    </div>
    <div class="flex flex-col gap-1 p-2">
      <slot />
    </div>
  </div>
</div>
