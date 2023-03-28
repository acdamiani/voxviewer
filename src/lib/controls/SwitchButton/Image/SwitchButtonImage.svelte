<script lang="ts">
  import SwitchButtonElement from '../SwitchButtonElement.svelte';
  import SwitchButtonImageElement from './SwitchButtonImageElement.svelte';

  export let value: string | undefined = undefined;
  export let url: string | URL | undefined = undefined;
</script>

{#if url}
  <SwitchButtonElement {value}>
    <SwitchButtonImageElement {url} />
  </SwitchButtonElement>
{/if}
