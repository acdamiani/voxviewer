import init, { WasmSampleBuffer, Spectrogram, Window } from 'rs';
import type { Reverser } from '$lib/util/types';

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

export function generateSpectrogram(
  buffer: AudioBuffer,
  {
    windowSize,
    zeroPaddingFactor = 1,
    windowFunction = 'hann',
  }: SpectrogramOptions,
): Promise<Float32Array> {
  const windowFunctionEnum = windowMap[windowFunction];

  return init().then((initResult) => {
    const wasmBuffer = new WasmSampleBuffer(
      buffer.length,
      (arr: Float32Array) => {
        buffer.copyFromChannel(arr, 0);
      },
    );

    // Figure out how I can only create a new spectrogram when settings change
    const spectrogram = new Spectrogram(
      windowSize,
      zeroPaddingFactor,
      windowFunctionEnum,
    );
    spectrogram.initialize(wasmBuffer);

    const windows = spectrogram.windows();
    const bins = spectrogram.bins();

    console.log(windows);
    console.log(bins);

    const ptr = spectrogram.compute();

    return new Float32Array(initResult.memory.buffer, ptr, windows * bins);
  });
}
