import { Spectrogram, WasmSampleBuffer } from 'rs';
import SpectrogramWorker from './spectrogram-worker?worker';
import { type SpectrogramOptions, windowMap, colorschemeMap } from './glue';

function defaultOptions(
  options: SpectrogramOptions,
): Required<SpectrogramOptions> {
  return {
    windowSize: options.windowSize,
    zeroPaddingFactor: options.zeroPaddingFactor ?? 1,
    windowFunction: options.windowFunction ?? 'hann',
    offset: options.offset ?? 20,
    range: options.range ?? 80,
    colorscheme: options.colorscheme ?? 'magma',
  };
}

export default class JsSpectrogram {
  private _spectrogram: Spectrogram | null;
  private _worker: Worker | null;
  private _memory: ArrayBuffer | null;

  readonly info: Required<SpectrogramOptions>;

  private constructor(
    spectrogram: Spectrogram | null,
    memory: ArrayBuffer | null,
    worker: Worker | null,
    info: Required<SpectrogramOptions>,
  ) {
    this._spectrogram = spectrogram;
    this._memory = memory;
    this._worker = worker;

    if (this._spectrogram && !this._memory) {
      throw new Error(
        'ArrayBuffer WebAssembly memory required when using synchronous spectrogram generation',
      );
    }

    this.info = info;
  }

  private _getWorkerValue<T>(value: string): Promise<T> {
    const worker = this._worker;

    if (!worker) {
      throw new Error('Cannot get worker value when worker is null');
    }

    return new Promise((resolve, reject) => {
      worker.onerror = (e) => {
        reject(e);
      };

      worker.onmessage = (e) => {
        if (e.data.type === 'result') {
          resolve(e.data.result as T);
        }
      };

      worker.postMessage({
        type: value,
      });
    });
  }

  private async _workerBufferHelper(): Promise<{
    memory: ArrayBuffer;
    ptr: number;
    len: number;
  }> {
    const memory = await this._getWorkerValue<ArrayBuffer>('memory');
    const ptr = await this._getWorkerValue<number>('ptr');
    const bins = await this._getWorkerValue<number>('bins');
    const windows = await this._getWorkerValue<number>('windows');

    return {
      memory: memory,
      ptr: ptr,
      len: bins * windows * 3,
    };
  }

  get bins(): Promise<number> {
    if (this._spectrogram) {
      return Promise.resolve(this._spectrogram.bins());
    } else if (this._worker) {
      return this._getWorkerValue<number>('bins');
    }

    throw new Error(
      'Provided neither a spectrogram on the main thread or a web worker',
    );
  }

  get windows(): Promise<number> {
    if (this._spectrogram) {
      return Promise.resolve(this._spectrogram.windows());
    } else if (this._worker) {
      return this._getWorkerValue<number>('windows');
    }

    throw new Error(
      'Provided neither a spectrogram on the main thread or a web worker',
    );
  }

  get buffer(): Promise<Uint8Array> {
    if (this._spectrogram && this._memory) {
      return Promise.resolve(
        new Uint8Array(
          this._memory,
          this._spectrogram.data_ptr(),
          this._spectrogram.windows() * this._spectrogram.bins() * 3,
        ),
      );
    } else if (this._worker) {
      return this._workerBufferHelper().then((v) => {
        return new Uint8Array(v.memory, v.ptr, v.len);
      });
    }

    throw new Error(
      'Provided neither a spectrogram on the main thread or a web worker',
    );
  }

  static async generateWithWorker(
    samples: Float32Array,
    options: SpectrogramOptions,
  ): Promise<JsSpectrogram> {
    const inputOptions = defaultOptions(options);

    const worker = new SpectrogramWorker();

    worker.postMessage({
      type: 'gen',
      samples: samples,
      options: inputOptions,
    });

    return new Promise((resolve, reject) => {
      worker.onerror = (e) => {
        reject(e);
      };

      worker.onmessage = (e) => {
        if (e.data.type === 'success') {
          resolve(new JsSpectrogram(null, null, worker, inputOptions));
        }
      };
    });
  }

  static generate(
    memory: ArrayBuffer,
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
    spectrogram.compute();

    return new JsSpectrogram(spectrogram, memory, null, inputOptions);
  }
}
