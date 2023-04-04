import JsSpectrogram from './spectrogram';
import type { SpectrogramOptions } from './glue';

export default class SpectrogramData {
  readonly channels: number;
  readonly options: SpectrogramOptions;
  private _spectrograms: JsSpectrogram[];

  private constructor(channels: number, options: SpectrogramOptions) {
    this.channels = channels;
    this.options = options;

    this._spectrograms = [];
  }

  private _insertSpectrogram(spectrogram: JsSpectrogram) {
    this._spectrograms.push(spectrogram);
  }

  spectrogram(channel: number): JsSpectrogram {
    return this._spectrograms[channel];
  }

  static async createFromAudioBuffer(
    buffer: AudioBuffer,
    {
      webWorker = true,
      ...options
    }: { webWorker?: boolean } & SpectrogramOptions,
  ): Promise<SpectrogramData> {
    const sample: Float32Array = new Float32Array(buffer.length);
    let data: SpectrogramData | null = null;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      buffer.copyFromChannel(sample, i);
      const output = await (webWorker
        ? JsSpectrogram.generateWithWorker(sample, options)
        : JsSpectrogram.generate(sample, options));

      data = data ?? new SpectrogramData(buffer.numberOfChannels, options);
      data._insertSpectrogram(output);
    }

    if (!data) {
      throw new Error('Not able to generate spectrogram');
    }

    return data;
  }
}
