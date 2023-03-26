<div class="flex flex-col gap-2">
  <span
    class="font-semibold uppercase tracking-widest text-xs text-neutral-500"
  >
    <slot name="title" />
  </span>
  <div class="grid grid-cols-4 grid-rows-2 aspect-[16/5]">
    <slot />
  </div>
</div>
