<script lang="ts">
  export let url: string | URL | null = null;
</script>

{#if url}
  <div class="flex items-center justify-center">
    <button
      class="w-16 h-10 rounded-md bg-cover border-gray-400 shadow-highlight"
      style="background-image: url({url});"
    />
  </div>
{/if}
