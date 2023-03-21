import { WasmSampleBuffer, Spectrogram, type InitOutput } from 'rs';
import type { SpectrogramOptions } from './spectrogram-data';

export const windowMap = {
  rectangular: 0, // Window.Rectangular
  bartlett: 1, // Window.Bartlett
  hamming: 2, // Window.Hamming
  hann: 3, // Window.Hann
  blackman: 4, // Window.Blackman
  welch: 6, // Window.Welch
  'blackman-harris': 5, // Window.BlackmanHarris
  'gaussian-2.5': 7, // Window.Gaussian25
  'gaussian-3.5': 8, // Window.Gaussian35
  'gaussian-4.5': 9, // Window.Gaussian45
} as const;

export type WindowFunction = keyof typeof windowMap;

export const colorschemeMap = {
  blackWhite: 0, // Colorscheme.BlackWhite
  viridis: 1, // Colorscheme.Viridis
  inferno: 2, // Colorscheme.Inferno
  magma: 3, // Colorscheme.Magma
  plasma: 4, // Colorscheme.Plasma
  cividis: 5, // Colorscheme.Cividis
  warm: 6, // Colorscheme.Warm
  cool: 7, // Colorscheme.Cool
};

export type Colorscheme = keyof typeof colorschemeMap;

export type GenerateSpectrogramOutput = {
  spectrogram: Spectrogram;
  initOutput: InitOutput | null;
};

export function generateSpectrogram(
  webWorker: boolean,
  buffer: Float32Array,
  options: Required<SpectrogramOptions>,
): GenerateSpectrogramOutput {
  const wasmBuffer = new WasmSampleBuffer(buffer);

  // Figure out how I can only create a new spectrogram when settings change
  const spectrogram = new Spectrogram(
    options.windowSize,
    options.zeroPaddingFactor,
    windowMap[options.windowFunction],
    options.offset,
    options.range,
    colorschemeMap[options.colorscheme],
  );

  spectrogram.initialize(wasmBuffer);
  spectrogram.compute();

  return {
    spectrogram: spectrogram,
    initOutput: webWorker ? null : null,
  };
}
