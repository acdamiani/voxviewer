<script lang="ts">
  import Group from '$lib/controls/Group.svelte';
  import SwitchButton from '$lib/controls/SwitchButton/SwitchButton.svelte';
  import SwitchButtonIcon from '$lib/controls/SwitchButton/Icon/SwitchButtonIcon.svelte';
  import SwitchButtonText from '$lib/controls/SwitchButton/Text/SwitchButtonText.svelte';
  import type {
    GaussianAlphas,
    WindowFunctionKinds,
  } from '$lib/view/spectrogram/glue';

  import IconRectangular from '~icons/window-functions/rectangular';
  import IconHamming from '~icons/window-functions/hamming';
  import IconHann from '~icons/window-functions/hann';
  import IconWelch from '~icons/window-functions/welch';
  import IconBartlett from '~icons/window-functions/bartlett';
  import IconBlackman from '~icons/window-functions/blackman';
  import IconBlackmanHarris from '~icons/window-functions/blackman-harris';
  import IconGaussian from '~icons/window-functions/gaussian';

  export let windowFunctionKind: WindowFunctionKinds = 'hann';
  export let gaussianAlpha: GaussianAlphas = '2.5';
</script>

<Group>
  <span slot="title">Window Function</span>
  <SwitchButton bind:value={windowFunctionKind}>
    <SwitchButtonIcon value="rectangular">
      <span slot="name">Rectangular</span>
      <IconRectangular />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="bartlett">
      <span slot="name">Bartlett</span>
      <IconBartlett />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="hamming">
      <span slot="name">Hamming</span>
      <IconHamming />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="hann">
      <span slot="name">Hann</span>
      <IconHann />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="blackman">
      <span slot="name">Blackman</span>
      <IconBlackman />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="blackman-harris">
      <span slot="name">Blackman-Harris</span>
      <IconBlackmanHarris />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="welch">
      <span slot="name">Welch</span>
      <IconWelch />
    </SwitchButtonIcon>
    <SwitchButtonIcon value="gaussian">
      <span slot="name">Gaussian</span>
      <IconGaussian />
    </SwitchButtonIcon>
  </SwitchButton>
</Group>

{#if windowFunctionKind === 'gaussian'}
  <Group>
    <span slot="title">Gaussian Alpha</span>
    <SwitchButton rows={1} bind:value={gaussianAlpha}>
      <SwitchButtonText value="2.5">α=2.5</SwitchButtonText>
      <SwitchButtonText value="3.5">α=3.5</SwitchButtonText>
      <SwitchButtonText value="4.5">α=4.5</SwitchButtonText>
    </SwitchButton>
  </Group>
{/if}
