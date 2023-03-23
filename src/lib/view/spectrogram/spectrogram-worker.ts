/// <reference lib="webworker" />

// WARNING: Do not move this
import './worker-url';

import init, { WasmSampleBuffer, Spectrogram, type InitOutput } from 'rs';
// https://github.com/vitejs/vite/issues/4551#issuecomment-983012078
import wasmUrl from 'rs/rs_bg.wasm?url';
import { colorschemeMap, windowMap, type SpectrogramOptions } from './glue';

declare const self: DedicatedWorkerGlobalScope;

type SpectrogramMessage = {
  samples: Float32Array;
  options: Required<SpectrogramOptions>;
};

self.onmessage = (e) => {
  const data = e.data as SpectrogramMessage;

  if (!data) {
    return;
  }

  const { samples, options } = data;

  init(wasmUrl).then((output) => {
    const spectrogram = new Spectrogram(
      options.windowSize,
      options.zeroPaddingFactor,
      windowMap[options.windowFunction],
      options.offset,
      options.range,
      colorschemeMap[options.colorscheme],
    );

    spectrogram.initialize(new WasmSampleBuffer(samples));

    const bins = spectrogram.bins();
    const windows = spectrogram.windows();

    const arr = new Uint8Array(bins * windows * 3);

    spectrogram.compute(arr);

    self.postMessage(
      {
        bins: bins,
        windows: windows,
        buffer: arr,
      },
      [arr.buffer],
    );
  });
};
