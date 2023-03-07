import type { Mutable } from '$lib/util/types';

export default class AudioFile {
  private static _ctx: AudioContext | null = null;
  private _blob: Blob;

  readonly buffer: AudioBuffer | null = null;

  constructor(blob: Blob) {
    if (AudioFile._ctx === null) {
      AudioFile._ctx = new AudioContext();
    }

    // Limit blob size to 25 MB
    if (blob.size > 2.5e7) {
      throw new Error('File size is greater than 25 MB');
    }

    this._blob = blob;
  }

  private _readFileAsync(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = reject;

      reader.readAsArrayBuffer(this._blob);
    });
  }

  async load(): Promise<AudioBuffer | undefined> {
    if (this.buffer) {
      return Promise.resolve(this.buffer);
    }

    const mutableThis = this as Mutable<AudioFile>;

    const f = await this._readFileAsync();
    return AudioFile._ctx
      ?.decodeAudioData(f)
      .then((b) => (mutableThis.buffer = b));
  }
}
