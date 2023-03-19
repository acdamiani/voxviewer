import type { WasmSampleBuffer, InitOutput, Spectrogram } from 'rs';
import type { WasmAudioBuffer } from '$lib/audio/audio';
import type { WindowFunction } from './spectrogram-gen';
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

  get buffer(): Float32Array {
    return new Float32Array(
      this._initResult.memory.buffer,
      this._spectrogram.data_ptr(),
      this.windows * this.bins,
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
    buffer: WasmAudioBuffer,
    { webWorker = true, ...options }: SpectrogramDataCreationOptions,
  ): Promise<SpectrogramData> {
    const inputOptions: Required<SpectrogramOptions> = {
      windowSize: options.windowSize,
      windowFunction: options.windowFunction ?? 'hann',
      zeroPaddingFactor: options.zeroPaddingFactor ?? 2,
    };

    // TODO: Web Worker support
    let sample: WasmSampleBuffer;
    let data: SpectrogramData | null = null;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      sample = buffer.bufferAt(i);
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
