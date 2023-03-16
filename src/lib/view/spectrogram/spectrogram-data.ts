import init, { WasmSampleBuffer } from 'rs';
import type { WasmAudioBuffer } from '$lib/audio/audio';
import type { SpectrogramOptions } from './spectrogram-gen';
import { generateSpectrogram } from './spectrogram-gen';

export class SpectrogramDataChannel {
  readonly buffer: Float32Array;

  constructor(buffer: Float32Array) {
    this.buffer = buffer;
  }
}

export type SpectrogramDataCreationOptions = {
  webWorker?: boolean;
} & SpectrogramOptions;

type SpectrogramDataOptions = {
  windows: number;
  bins: number;
  channels: number;
};

export default class SpectrogramData {
  readonly windows: number;
  readonly bins: number;
  readonly channels: number;

  private _channelsArr: SpectrogramDataChannel[];

  private constructor(options: SpectrogramDataOptions) {
    this.windows = options.windows;
    this.bins = options.bins;
    this.channels = options.channels;

    this._channelsArr = [];
  }

  private _pushChannel(buffer: Float32Array) {
    this._channelsArr.push(new SpectrogramDataChannel(buffer));
  }

  channelData(channel: number) {
    return this._channelsArr[channel].buffer;
  }

  static async createFromAudioBuffer(
    buffer: WasmAudioBuffer,
    { webWorker = true, ...options }: SpectrogramDataCreationOptions,
  ): Promise<SpectrogramData> {
    // TODO: Web Worker support

    const initResult = await init();

    let sample: WasmSampleBuffer;
    let data: SpectrogramData | null = null;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      sample = buffer.bufferAt(i);
      const output = generateSpectrogram(initResult, sample, options);

      data =
        data ??
        new SpectrogramData({
          windows: output.windows,
          bins: output.bins,
          channels: buffer.numberOfChannels,
        });
      data._pushChannel(output.buffer);
    }

    if (!data) {
      throw new Error('Not able to generate spectrogram');
    }

    return data;
  }
}
