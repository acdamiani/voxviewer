<script lang="ts">
  export let windowSize: number;
  export let zeroPaddingFactor: number;
</script>

<span class="font-semibold uppercase tracking-widest text-xs text-neutral-500">
  <slot name="title" />
</span>

<slot />
