<script lang="ts">
  import SwitchButtonElement from '../SwitchButtonElement.svelte';
  import SwitchButtonTextElement from './SwitchButtonTextElement.svelte';

  export let value: string | undefined = undefined;
</script>

<SwitchButtonElement {value}>
  <SwitchButtonTextElement>
    <slot />
  </SwitchButtonTextElement>
</SwitchButtonElement>
