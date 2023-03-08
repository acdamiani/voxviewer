import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';
import WaveformData from 'waveform-data';
import { zoom } from '$lib/stores';

export default class WaveformRenderer {
  readonly canvas: HTMLCanvasElement;

  private _waveform: Promise<WaveformData> | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private _scaleHeight(amplitude: number, height: number) {
    const range = 256;
    const offset = 128;

    return height - ((amplitude + offset) * height) / range;
  }

  private _draw(data: WaveformData, offset: number) {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing waveform canvas');
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();

    ctx.fillStyle = 'rgb(20 184 166)';
    const channel = data.channel(0);

    const length = Math.min(this.canvas.width, data.length - offset);

    for (let x = 0; x < length; x++) {
      const val = channel.max_sample(x + offset);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    for (let x = length - 1; x >= 0; x--) {
      const val = channel.min_sample(x + offset);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgb(20 184 166)';
    ctx.lineWidth = 1;

    if (data.length < this.canvas.width) {
      ctx.beginPath();
      ctx.moveTo(length - 0.5, this.canvas.height / 2);
      ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      ctx.stroke();
    }
  }

  async render(buffer: AudioBuffer, zoom: number, pan: number) {
    const options = {
      audio_buffer: buffer,
      scale: WAVEFORM_BASE_SAMPLES_PER_PIXEL,
    };

    if (this._waveform === null) {
      this._waveform = new Promise<WaveformData>((resolve, reject) => {
        WaveformData.createFromAudio(options, (err, waveform) => {
          if (err) {
            reject(err);
          } else {
            resolve(waveform);
          }
        });
      });
    }

    return this._waveform.then((waveform) => {
      const resampled = waveform.resample({ scale: waveform.scale * zoom });
      this._draw(resampled, Math.round(pan));
    });
  }
}
