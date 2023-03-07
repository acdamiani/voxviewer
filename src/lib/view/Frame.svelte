<script lang="ts">
  import Loader from '$lib/Loader.svelte';

  export let title = 'title';
</script>

<div class="h-full min-h-[16rem] relative border-t-2 border-zinc-800">
  <div
    class="absolute top-0 left-8 bg-zinc-800 rounded-b-lg opacity-50 px-4 py-1"
  >
    <span class="uppercase text-xs font-semibold tracking-widest leading-none"
      >{title}</span
    >
  </div>
  <!--<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader />
  </div>-->
</div>
