import init, { Spectrogram, WasmSampleBuffer } from 'rs';
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
  readonly bg: string;
  readonly id: string;

  readonly info: Required<SpectrogramOptions>;

  private constructor(
    buffer: Uint8Array,
    bins: number,
    windows: number,
    info: Required<SpectrogramOptions>,
    bg: string,
    id: string,
  ) {
    this.buffer = buffer;
    this.bins = bins;
    this.windows = windows;
    this.info = info;
    this.bg = bg;
    this.id = id;
  }

  get rgbBackground(): [number, number, number] {
    return this.bg
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (_, r, g, b) => '#' + r + r + g + g + b + b,
      )
      .substring(1)
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16)) as [number, number, number];
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
          bg,
          id,
        }: {
          bins: number;
          windows: number;
          buffer: Uint8Array;
          bg: string;
          id: string;
        } = e.data;

        resolve(new JsSpectrogram(buffer, bins, windows, inputOptions, bg, id));
      };
    });
  }

  static async generate(
    samples: Float32Array,
    options: SpectrogramOptions,
  ): Promise<JsSpectrogram> {
    return init().then(() => {
      const inputOptions = defaultOptions(options);

      const spectrogram = new Spectrogram(
        inputOptions.windowSize,
        inputOptions.zeroPaddingFactor,
        windowMap[inputOptions.windowFunction],
        inputOptions.overlap,
        inputOptions.offset,
        inputOptions.range,
        colorschemeMap[inputOptions.colorscheme],
      );

      spectrogram.initialize(new WasmSampleBuffer(samples));

      const bins = spectrogram.bins();
      const windows = spectrogram.windows();
      const bg = spectrogram.bg();
      const id = spectrogram.id();

      const arr = new Uint8Array(bins * windows * 3);

      spectrogram.compute(arr);
      spectrogram.free();

      return new JsSpectrogram(arr, bins, windows, inputOptions, bg, id);
    });
  }
}
