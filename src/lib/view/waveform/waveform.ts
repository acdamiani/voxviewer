import WaveformData from 'waveform-data';

export default class WaveformRenderer {
  readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private _scaleHeight(amplitude: number, height: number) {
    const range = 256;
    const offset = 128;

    return height - ((amplitude + offset) * height) / range;
  }

  private _draw(data: WaveformData) {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing waveform canvas');
    }

    ctx.beginPath();
    ctx.fillStyle = 'rgb(20 184 166)';
    const channel = data.channel(0);

    const length = Math.min(this.canvas.width, data.length);

    for (let x = 0; x < length; x++) {
      const val = channel.max_sample(x);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    for (let x = length - 1; x >= 0; x--) {
      const val = channel.min_sample(x);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.fill();
  }

  async render(buffer: AudioBuffer) {
    const options = {
      audio_buffer: buffer,
    };

    const p = new Promise<WaveformData>((resolve, reject) => {
      WaveformData.createFromAudio(options, (err, waveform) => {
        if (err) {
          reject(err);
        } else {
          resolve(waveform);
        }
      });
    });

    return p.then((d) => {
      this._draw(d);
    });
  }
}
