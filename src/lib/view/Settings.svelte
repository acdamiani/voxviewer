<script lang="ts">
  import { audio, settings } from '$lib/stores';

  import Button from '$lib/controls/Button.svelte';
  import FileInput from '$lib/controls/FileInput.svelte';
  import AudioFile from '$lib/audio/audio';
  import Checkbox from '$lib/controls/Checkbox.svelte';
  import Select from '$lib/controls/Select.svelte';
  import SwitchButton from '$lib/controls/SwitchButton/SwitchButton.svelte';
  import SwitchButtonIcon from '$lib/controls/SwitchButton/SwitchButtonIcon.svelte';
  import SwitchButtonText from '$lib/controls/SwitchButton/SwitchButtonText.svelte';
  import type { GaussianAlphas, WindowFunctionKinds } from './spectrogram/glue';

  import IconRectangular from '~icons/window-functions/rectangular';
  import IconHamming from '~icons/window-functions/hamming';
  import IconHann from '~icons/window-functions/hann';
  import IconWelch from '~icons/window-functions/welch';
  import IconBartlett from '~icons/window-functions/bartlett';
  import IconBlackman from '~icons/window-functions/blackman';
  import IconBlackmanHarris from '~icons/window-functions/blackman-harris';
  import IconGaussian from '~icons/window-functions/gaussian';
  import IconWelchOverlap from '~icons/window-functions/welch-overlap';
  import IconBartlettOverlap from '~icons/window-functions/bartlett-overlap';

  import ColorschemeSwitcher from '$lib/controls/ColorschemeSwitcher/ColorschemeSwitcher.svelte';
  import Colorscheme from '$lib/controls/ColorschemeSwitcher/Colorscheme.svelte';

  let file: File | undefined = undefined;
  let audioFile: AudioFile | null = null;

  audio.subscribe((a) => {
    audioFile = a;
  });

  const loadFile = () => {
    if (!file) {
      return;
    }

    if (audioFile?.blob !== file) {
      audio.set(new AudioFile(file));
    }
  };

  let windowFunction: WindowFunctionKinds = 'hann';
  let gaussianAlpha: GaussianAlphas = '2.5';
  let overlapMethod: 'welch' | 'bartlett' = 'welch';
  let windowSize = '1024';
  let zeroPaddingFactor = '1';

  $: {
    settings.set({
      ...$settings,
      windowSize: parseInt(windowSize),
      windowFunction:
        windowFunction === 'gaussian'
          ? `${windowFunction}-${gaussianAlpha}`
          : windowFunction,
    });
  }
</script>

<div
  class="flex-none basis-[22rem] max-w-[22rem] border-r-2 border-zinc-800 flex flex-col p-4 gap-3"
>
  <h2 class="font-bold text-lg">Settings</h2>
  <FileInput readFileResult={(f) => (file = f)} accept="audio/*" />

  <SwitchButton bind:value={windowFunction}>
    <span slot="title">Window Function</span>
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

  {#if windowFunction === 'gaussian'}
    <SwitchButton rows={1} bind:value={gaussianAlpha}>
      <span slot="title">Gaussian Alpha</span>
      <SwitchButtonText value="2.5">α=2.5</SwitchButtonText>
      <SwitchButtonText value="3.5">α=3.5</SwitchButtonText>
      <SwitchButtonText value="4.5">α=4.5</SwitchButtonText>
    </SwitchButton>
  {/if}

  <SwitchButton rows={1} bind:value={overlapMethod}>
    <span slot="title">Overlap Method</span>
    <SwitchButtonIcon value="welch">
      <IconWelchOverlap />
      <span slot="name">Welch</span>
    </SwitchButtonIcon>
    <SwitchButtonIcon value="bartlett">
      <IconBartlettOverlap />
      <span slot="name">Bartlett</span></SwitchButtonIcon
    >
  </SwitchButton>

  <Select bind:value={windowSize}>
    <span slot="label">Window size</span>
    <option value="128">128</option>
    <option value="256">256</option>
    <option value="512">512</option>
    <option value="1024" selected>1024</option>
    <option value="2048">2048</option>
    <option value="4096">4096</option>
    <option value="8192">8192</option>
  </Select>

  <Select bind:value={zeroPaddingFactor}>
    <span slot="label">Zero padding factor</span>
    <option selected>1</option>
    <option>2</option>
    <option>4</option>
    <option>8</option>
    <option>16</option>
    <option>32</option>
  </Select>

  <ColorschemeSwitcher>
    <span slot="title">Colorscheme</span>
    <Colorscheme url="/ramps/vidris.png" />
    <Colorscheme url="/ramps/inferno.png" />
    <Colorscheme url="/ramps/magma.png" />
    <Colorscheme url="/ramps/plasma.png" />
    <Colorscheme url="/ramps/cividis.png" />
    <Colorscheme url="/ramps/warm.png" />
    <Colorscheme url="/ramps/cool.png" />
    <Colorscheme url="/ramps/gray.png" />
  </ColorschemeSwitcher>
  <Button disabled={!file} on:click={loadFile}>Load</Button>
</div>
