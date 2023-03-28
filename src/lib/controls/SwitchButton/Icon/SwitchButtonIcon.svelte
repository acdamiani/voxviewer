<script lang="ts">
  import SwitchButtonElement from '../SwitchButtonElement.svelte';
  import SwitchButtonIconElement from './SwitchButtonIconElement.svelte';

  export let value: string | undefined = undefined;
</script>

<SwitchButtonElement {value}>
  <SwitchButtonIconElement>
    <slot />
    <slot name="name" slot="name" />
  </SwitchButtonIconElement>
</SwitchButtonElement>
