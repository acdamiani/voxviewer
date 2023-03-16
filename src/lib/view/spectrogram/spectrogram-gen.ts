import { WasmSampleBuffer, Spectrogram } from 'rs';
import type { InitOutput } from 'rs';
import type { SpectrogramOptions } from './spectrogram-data';

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

export type WindowFunction = keyof typeof windowMap;

// TODO: return a `WaveformData` like class instead of a raw Float32Array
export function generateSpectrogram(
  buffer: WasmSampleBuffer,
  options: Required<SpectrogramOptions>,
): Spectrogram {
  // Figure out how I can only create a new spectrogram when settings change
  const spectrogram = new Spectrogram(
    options.windowSize,
    options.zeroPaddingFactor,
    windowMap[options.windowFunction],
  );
  spectrogram.initialize(buffer);
  spectrogram.compute();

  return spectrogram;
}
