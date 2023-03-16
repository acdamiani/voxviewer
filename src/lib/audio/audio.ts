import init, { WasmSampleBuffer } from 'rs';

type WasmAudioBufferOptions = {
  buffer: AudioBuffer;
  numberOfChannels: number;
  duration: number;
  sampleRate: number;
  length: number;
};

export class WasmAudioBuffer {
  readonly buffer: AudioBuffer;
  readonly numberOfChannels: number;
  readonly duration: number;
  readonly sampleRate: number;
  readonly length: number;

  private _channels: WasmSampleBuffer[];

  private constructor(options: WasmAudioBufferOptions) {
    // Unfortunately, waveform-data.js will only work if I have an AudioBuffer on the JavaScript side.
    // This means that I have to keep two copies of the same PCM samples; one on the JavaScript side and one on the WASM side.
    this.buffer = options.buffer;
    this.numberOfChannels = options.numberOfChannels;
    this.duration = options.duration;
    this.sampleRate = options.sampleRate;
    this.length = options.length;

    this._channels = [];
  }

  bufferAt(channel: number): WasmSampleBuffer {
    return this._channels[channel];
  }

  private async _load(
    buffer: AudioBuffer,
    channelNumber: number,
  ): Promise<void> {
    const channel = new WasmSampleBuffer(self.length, (arr: Float32Array) => {
      buffer.copyFromChannel(arr, channelNumber);
    });

    this._channels.push(channel);
  }

  static async create(buffer: AudioBuffer): Promise<WasmAudioBuffer> {
    const wasmBuffer = new WasmAudioBuffer({
      buffer: buffer,
      numberOfChannels: buffer.numberOfChannels,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      length: buffer.length,
    });

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      await wasmBuffer._load(buffer, i);
    }

    return wasmBuffer;
  }

  getChannelData(channel: number): WasmSampleBuffer {
    if (channel > this.numberOfChannels - 1) {
      throw new Error(`Channel ${channel} does not exist`);
    }

    return this._channels[channel];
  }
}

export default class AudioFile {
  private static _ctx: AudioContext;
  readonly blob: Blob;
  private _buffer: WasmAudioBuffer | null = null;

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

  get buffer(): WasmAudioBuffer | null {
    return this._buffer;
  }

  async load(): Promise<WasmAudioBuffer> {
    if (this._buffer !== null) {
      return Promise.resolve(this._buffer);
    }

    return this._readFileAsync()
      .then((file) => AudioFile._ctx.decodeAudioData(file))
      .then((buffer) => WasmAudioBuffer.create(buffer))
      .then((wasmBuffer) => {
        this._buffer = wasmBuffer;
        return wasmBuffer;
      });
  }
}
