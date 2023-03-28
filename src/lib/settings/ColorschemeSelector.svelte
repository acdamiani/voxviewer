<script lang="ts">
  import Group from '$lib/controls/Group.svelte';
  import SwitchButton from '$lib/controls/SwitchButton/SwitchButton.svelte';
  import SwitchButtonImage from '$lib/controls/SwitchButton/Image/SwitchButtonImage.svelte';
  import type { Colorscheme } from '$lib/view/spectrogram/glue';

  export let colorscheme: Colorscheme = 'viridis';
</script>

<Group>
  <span slot="title">Colorscheme</span>
  <SwitchButton rows={2} background={false} gap="gap" bind:value={colorscheme}>
    <SwitchButtonImage value="viridis" url="/ramps/viridis.png" />
    <SwitchButtonImage value="inferno" url="/ramps/inferno.png" />
    <SwitchButtonImage value="magma" url="/ramps/magma.png" />
    <SwitchButtonImage value="plasma" url="/ramps/plasma.png" />
    <SwitchButtonImage value="cividis" url="/ramps/cividis.png" />
    <SwitchButtonImage value="warm" url="/ramps/warm.png" />
    <SwitchButtonImage value="cool" url="/ramps/cool.png" />
    <SwitchButtonImage value="gray" url="/ramps/gray.png" />
  </SwitchButton>
</Group>
