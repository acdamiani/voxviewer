import { WasmSampleBuffer, Spectrogram } from 'rs';
import type { InitOutput } from 'rs';

const windowMap = {
  bartlett: 1, // Window.Bartlett
  blackman: 4, // Window.Blackman
  'blackman-harris': 5, // Window.BlackmanHarris
  'gaussian-2.5': 7, // Window.Gaussian25
  'gaussian-3.5': 8, // Window.Gaussian35
  'gaussian-4.5': 9, // Window.Gaussian45
  hamming: 2, // Window.Hamming
  hann: 3, // Window.Hann
  rectangular: 0, // Window.Rectangular
  welch: 9, // Window.Welch
} as const;

type WindowFunction = keyof typeof windowMap;

export type SpectrogramOptions = {
  windowSize: number;
  zeroPaddingFactor?: number;
  windowFunction?: WindowFunction;
};

type GenerateSpectrogramResult = {
  buffer: Float32Array;
  windows: number;
  bins: number;
};

// TODO: return a `WaveformData` like class instead of a raw Float32Array
export function generateSpectrogram(
  initResult: InitOutput,
  buffer: WasmSampleBuffer,
  {
    windowSize,
    zeroPaddingFactor = 1,
    windowFunction = 'hann',
  }: SpectrogramOptions,
): GenerateSpectrogramResult {
  const windowFunctionEnum = windowMap[windowFunction];

  // Figure out how I can only create a new spectrogram when settings change
  const spectrogram = new Spectrogram(
    windowSize,
    zeroPaddingFactor,
    windowFunctionEnum,
  );
  spectrogram.initialize(buffer);

  const windows = spectrogram.windows();
  const bins = spectrogram.bins();

  const ptr = spectrogram.compute();
  const result = new Float32Array(
    initResult.memory.buffer,
    ptr,
    windows * bins,
  );

  return {
    windows: windows,
    bins: bins,
    buffer: result,
  };
}
