/// <reference lib="webworker" />

// WARNING: Do not move this
import './worker-url';

import init, { WasmSampleBuffer, Spectrogram, type InitOutput } from 'rs';
// https://github.com/vitejs/vite/issues/4551#issuecomment-983012078
import wasmUrl from 'rs/rs_bg.wasm?url';
import { colorschemeMap, windowMap, type SpectrogramOptions } from './glue';

declare const self: DedicatedWorkerGlobalScope & {
  spectrogram: Spectrogram | null;
  initResult: InitOutput | null;
  document: { baseURI: string };
};

type SpectrogramMessage = {
  type: 'gen' | 'ptr' | 'bins' | 'windows' | 'memory';
  samples: Float32Array | null;
  options: Required<SpectrogramOptions> | null;
};

self.spectrogram = null;
self.initResult = null;

self.onmessage = (e) => {
  const data = e.data as SpectrogramMessage;

  if (!data) {
    return;
  }

  const { type, samples, options } = data;

  switch (type) {
    case 'gen':
      if (!samples) {
        throw new Error(
          "A sample buffer should be provided when message of type 'gen' is sent",
        );
      } else if (!options) {
        throw new Error(
          "A options message property should be provided when message of type 'gen' is sent",
        );
      }

      self.spectrogram?.free();

      init(wasmUrl).then((o) => {
        self.initResult = o;
        self.spectrogram = new Spectrogram(
          options.windowSize,
          options.zeroPaddingFactor,
          windowMap[options.windowFunction],
          options.offset,
          options.range,
          colorschemeMap[options.colorscheme],
        );

        self.spectrogram.initialize(new WasmSampleBuffer(samples));
        self.spectrogram.compute();

        self.postMessage({
          type: 'success',
        });
      });

      break;
    case 'ptr':
      if (!self.spectrogram) {
        throw new Error("A 'ptr' message must be preceded by a 'gen' message");
      }

      self.postMessage({
        type: 'result',
        result: self.spectrogram.data_ptr(),
      });

      break;
    case 'windows':
      if (!self.spectrogram) {
        throw new Error(
          "A 'windows' message must be preceded by a 'gen' message",
        );
      }

      self.postMessage({
        type: 'result',
        result: self.spectrogram.windows(),
      });

      break;
    case 'bins':
      if (!self.spectrogram) {
        throw new Error("A 'bins' message must be preceded by a 'gen' message");
      }

      self.postMessage({
        type: 'result',
        result: self.spectrogram.bins(),
      });

      break;
    case 'memory':
      if (!self.initResult) {
        throw new Error(
          "A 'memory' message must be preceded by a 'gen' message",
        );
      }

      self.postMessage({
        type: 'result',
        result: self.initResult.memory.buffer,
      });
  }
};
