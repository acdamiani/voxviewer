<script lang="ts">
  import IconAlert from '~icons/octicon/alert-fill-24';

  export let error: Error;
</script>

<div
  class="absolute inset-0 flex items-center justify-center text-red-500 flex-col gap-1"
>
  <span class="text-6xl">
    <IconAlert />
  </span>
  <div class="flex flex-col items-center">
    <h3 class="text-lg font-black">
      {error.name}
    </h3>
    <p class="text-sm">
      {error.message}
    </p>
  </div>
</div>
