import type { WasmSampleBuffer, InitOutput, Spectrogram } from 'rs';
import type { WasmAudioBuffer } from '$lib/audio/audio';
import type { Colorscheme, WindowFunction } from './spectrogram-gen';
import { generateSpectrogram } from './spectrogram-gen';

export class SpectrogramDataChannel {
  readonly windows: number;
  readonly bins: number;

  private _spectrogram: Spectrogram;
  private _initResult: InitOutput;

  constructor(initResult: InitOutput, spectrogram: Spectrogram) {
    this._spectrogram = spectrogram;
    this._initResult = initResult;

    this.windows = spectrogram.windows();
    this.bins = spectrogram.bins();
  }

  get buffer(): Uint8Array {
    return new Uint8Array(
      this._initResult.memory.buffer,
      this._spectrogram.data_ptr(),
      this.windows * this.bins * 3,
    );
  }
}

export type SpectrogramDataCreationOptions = {
  webWorker?: boolean;
} & SpectrogramOptions;

type SpectrogramDataOptions = {
  initResult: InitOutput;
  channels: number;
} & Required<SpectrogramOptions>;

export type SpectrogramOptions = {
  windowSize: number;
  zeroPaddingFactor?: number;
  windowFunction?: WindowFunction;
  offset?: number;
  range?: number;
  colorscheme?: Colorscheme;
};

export default class SpectrogramData {
  readonly channels: number;
  readonly windowSize: number;
  readonly windowFunc: Required<SpectrogramOptions>['windowFunction'];
  readonly zeroPaddingFactor: number;

  private _channelsArr: SpectrogramDataChannel[];
  private _initResult: InitOutput;

  private constructor(options: SpectrogramDataOptions) {
    this.channels = options.channels;
    this.windowSize = options.windowSize;
    this.windowFunc = options.windowFunction;
    this.zeroPaddingFactor = options.zeroPaddingFactor;

    this._channelsArr = [];
    this._initResult = options.initResult;
  }

  private _pushChannel(spectrogram: Spectrogram) {
    this._channelsArr.push(
      new SpectrogramDataChannel(this._initResult, spectrogram),
    );
  }

  channelData(channel: number): SpectrogramDataChannel {
    return this._channelsArr[channel];
  }

  static async createFromAudioBuffer(
    initResult: InitOutput,
    buffer: AudioBuffer,
    { webWorker = true, ...options }: SpectrogramDataCreationOptions,
  ): Promise<SpectrogramData> {
    const inputOptions: Required<SpectrogramOptions> = {
      windowSize: options.windowSize,
      windowFunction: options.windowFunction ?? 'hann',
      zeroPaddingFactor: options.zeroPaddingFactor ?? 4,
      offset: 20,
      range: 80,
      colorscheme: 'magma',
    };

    // TODO: Web Worker support
    const sample: Float32Array = new Float32Array(buffer.length);
    let data: SpectrogramData | null = null;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      buffer.copyFromChannel(sample, i);
      const output = generateSpectrogram(sample, inputOptions);

      data =
        data ??
        new SpectrogramData({
          initResult: initResult,
          channels: buffer.numberOfChannels,
          ...inputOptions,
        });

      data._pushChannel(output);
    }

    if (!data) {
      throw new Error('Not able to generate spectrogram');
    }

    return data;
  }
}
