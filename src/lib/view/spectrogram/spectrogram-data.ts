import JsSpectrogram from './spectrogram';
import type { SpectrogramOptions } from './glue';

export default class SpectrogramData {
  readonly channels: number;
  private _spectrograms: JsSpectrogram[];

  private constructor(channels: number) {
    this.channels = channels;
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
      const output = webWorker
        ? await JsSpectrogram.generateWithWorker(sample, options)
        : JsSpectrogram.generate(sample, options);

      data = data ?? new SpectrogramData(buffer.numberOfChannels);
      data._insertSpectrogram(output);
    }

    if (!data) {
      throw new Error('Not able to generate spectrogram');
    }

    return data;
  }
}
