<script lang="ts">
  import { audio, settings } from '$lib/stores';

  import Button from '$lib/controls/Button.svelte';
  import FileInput from '$lib/controls/FileInput.svelte';
  import AudioFile from '$lib/audio/audio';
  import Slider from '$lib/controls/Slider.svelte';
  import Group from '$lib/controls/Group.svelte';
  import SwitchButton from '$lib/controls/SwitchButton/SwitchButton.svelte';
  import SwitchButtonIcon from '$lib/controls/SwitchButton/Icon/SwitchButtonIcon.svelte';
  import ColorschemeSelector from '$lib/settings/ColorschemeSelector.svelte';
  import WindowFunctionSelector from '$lib/settings/WindowFunctionSelector.svelte';

  import SidebarTab from './SidebarTab.svelte';

  import type {
    GaussianAlphas,
    WindowFunctionKinds,
    Colorscheme,
    WindowFunction,
  } from '$lib/view/spectrogram/glue';

  import IconWelchOverlap from '~icons/window-functions/welch-overlap';
  import IconBartlettOverlap from '~icons/window-functions/bartlett-overlap';

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

  let windowFunctionKind: WindowFunctionKinds = 'hann';
  let gaussianAlpha: GaussianAlphas = '2.5';
  let colorscheme: Colorscheme = 'magma';
  let overlapMethod: 'welch' | 'bartlett' = 'welch';
  let windowSize = 10;
  let zeroPaddingFactor = 1;

  $: {
    settings.set({
      ...$settings,
      windowSize: 2 ** windowSize,
      zeroPaddingFactor: 2 ** zeroPaddingFactor,
      windowFunction: (windowFunctionKind === 'gaussian'
        ? `gaussian-${gaussianAlpha}`
        : windowFunctionKind) as WindowFunction,
      colorscheme: colorscheme,
    });
  }
</script>

<div class="flex flex-col gap-3">
  <FileInput readFileResult={(f) => (file = f)} accept="audio/*" />

  <WindowFunctionSelector bind:windowFunctionKind bind:gaussianAlpha />

  <Group>
    <span slot="title">Overlap Method</span>
    <SwitchButton rows={1} bind:value={overlapMethod}>
      <SwitchButtonIcon value="welch">
        <IconWelchOverlap />
        <span slot="name">Welch</span>
      </SwitchButtonIcon>
      <SwitchButtonIcon value="bartlett">
        <IconBartlettOverlap />
        <span slot="name">Bartlett</span></SwitchButtonIcon
      >
    </SwitchButton>
  </Group>

  <Group>
    <span slot="title">Window Size</span>
    <Slider
      min={2}
      max={13}
      minLabel="8"
      maxLabel="8192"
      bind:value={windowSize}
      displayValue={(v) => 2 ** v}
    />
  </Group>

  <Group>
    <span slot="title">Zero Padding Factor</span>
    <Slider
      min={0}
      max={5}
      minLabel="1x"
      maxLabel="32x"
      bind:value={zeroPaddingFactor}
      displayValue={(v) => `${2 ** v}x`}
    />
  </Group>

  <ColorschemeSelector bind:colorscheme />

  <Button disabled={!file} on:click={loadFile}>Load</Button>
</div>
