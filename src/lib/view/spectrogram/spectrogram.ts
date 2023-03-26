import { Spectrogram, WasmSampleBuffer } from 'rs';
import SpectrogramWorker from './spectrogram-worker?worker';
import {
  type SpectrogramOptions,
  windowMap,
  colorschemeMap,
  defaultOptions,
} from './glue';

export default class JsSpectrogram {
  readonly buffer: Uint8Array;
  readonly bins: number;
  readonly windows: number;

  readonly info: Required<SpectrogramOptions>;

  private constructor(
    buffer: Uint8Array,
    bins: number,
    windows: number,
    info: Required<SpectrogramOptions>,
  ) {
    this.buffer = buffer;
    this.bins = bins;
    this.windows = windows;
    this.info = info;
  }

  static async generateWithWorker(
    samples: Float32Array,
    options: SpectrogramOptions,
  ): Promise<JsSpectrogram> {
    const inputOptions = defaultOptions(options);

    const worker = new SpectrogramWorker();

    worker.postMessage({
      samples: samples,
      options: inputOptions,
    });

    return new Promise((resolve, reject) => {
      worker.onerror = (e) => {
        reject(e);
      };

      worker.onmessage = (e) => {
        const {
          bins,
          windows,
          buffer,
        }: { bins: number; windows: number; buffer: Uint8Array } = e.data;

        resolve(new JsSpectrogram(buffer, bins, windows, inputOptions));
      };
    });
  }

  static generate(
    samples: Float32Array,
    options: SpectrogramOptions,
  ): JsSpectrogram {
    const inputOptions = defaultOptions(options);

    const spectrogram = new Spectrogram(
      inputOptions.windowSize,
      inputOptions.zeroPaddingFactor,
      windowMap[inputOptions.windowFunction],
      inputOptions.offset,
      inputOptions.range,
      colorschemeMap[inputOptions.colorscheme],
    );

    spectrogram.initialize(new WasmSampleBuffer(samples));

    const bins = spectrogram.bins();
    const windows = spectrogram.windows();

    const arr = new Uint8Array(bins * windows * 3);

    spectrogram.compute(arr);

    return new JsSpectrogram(arr, bins, windows, inputOptions);
  }
}
