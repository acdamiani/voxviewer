export default class AudioFile {
  private static _ctx: AudioContext;
  readonly blob: Blob;
  private _buffer: AudioBuffer | null = null;

  constructor(blob: Blob) {
    if (!AudioFile._ctx) {
      AudioFile._ctx = new AudioContext();
    }

    // Limit blob size to 25 MB
    if (blob.size > 2.5e7) {
      throw new Error('File size is greater than 25 MB');
    }

    this.blob = blob;
  }

  private _readFileAsync(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = reject;

      reader.readAsArrayBuffer(this.blob);
    });
  }

  get buffer(): AudioBuffer | null {
    return this._buffer;
  }

  async load(): Promise<AudioBuffer> {
    if (this._buffer !== null) {
      return Promise.resolve(this._buffer);
    }

    return this._readFileAsync()
      .then((file) => AudioFile._ctx.decodeAudioData(file))
      .then((buffer) => {
        this._buffer = buffer;
        return buffer;
      });
  }
}
