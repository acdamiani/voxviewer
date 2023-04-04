export default class AudioPlayer {
  private _buffer: AudioBuffer;
  private _context: AudioContext;
  private _source: AudioBufferSourceNode;
  private _playing: boolean;
  private _offset: number;
  private _timeStamp: number;

  constructor(context: AudioContext, buffer: AudioBuffer) {
    this._context = context;
    this._buffer = buffer;
    this._playing = false;
    this._offset = 0;

    this._createSource();
  }

  private _createSource() {
    this._source = this._context.createBufferSource();
    this._source.buffer = this._buffer;

    this._source.connect(this._context.destination);
    this._source.onended = this._endPlayback;
  }

  private _endPlayback() {
    this._playing = false;
  }

  play() {
    if (this._playing) {
      return;
    }

    this._createSource();
    this._source.start(0, this._offset);
    this._timeStamp = Date.now();
    this._playing = true;
  }

  seek(offset: number) {
    const playing = this._playing;

    if (playing) {
      this.pause();
    }

    this._offset = offset;

    if (playing) {
      this.play();
    }
  }

  pause() {
    if (!this._playing) {
      return;
    }

    this._source.stop();
    this._offset += (Date.now() - this._timeStamp) / 1000;
    this._playing = false;
  }

  get playing(): boolean {
    return this._playing;
  }

  get position(): number {
    if (!this._playing) {
      return this._offset;
    }

    return this._offset + (Date.now() - this._timeStamp) / 1000;
  }
}
