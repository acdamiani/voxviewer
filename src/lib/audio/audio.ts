export default class AudioFile {
  private static _ctx: AudioContext | null = null;
  readonly blob: Blob;
  private _buffer: AudioBuffer | null = null;
  private _test = 0;

  constructor(blob: Blob) {
    if (AudioFile._ctx === null) {
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

  async load(): Promise<AudioBuffer | undefined> {
    if (this._buffer !== null) {
      return Promise.resolve(this._buffer);
    }

    const f = await this._readFileAsync();
    return AudioFile._ctx?.decodeAudioData(f).then((b) => {
      this._buffer = b;
      return b;
    });
  }
}
