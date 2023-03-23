import { WAVEFORM_BASE_SAMPLES_PER_PIXEL, ZOOM_FAC } from '$lib/util/constants';
import WaveformData from 'waveform-data';

export default class WaveformRenderer {
  readonly canvas: HTMLCanvasElement;
  private _lastZoom = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private _scaleHeight(amplitude: number, height: number) {
    const range = 256;
    const offset = 128;

    return height - ((amplitude + offset) * height) / range;
  }

  private _draw(data: WaveformData, offset: number, cache: boolean) {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing waveform canvas');
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();

    ctx.fillStyle = 'rgb(20 184 166)';
    const channel = data.channel(0);

    for (let x = 0; x < data.length; x++) {
      const val = channel.max_sample(x);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    for (let x = data.length - 1; x >= 0; x--) {
      const val = channel.min_sample(x);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.fill();

    // if (data.length - offset < this.canvas.width) {
    //   ctx.strokeStyle = 'rgb(20 184 166)';
    //   ctx.beginPath();
    //   ctx.moveTo(data.length - offset - 1, this.canvas.height / 2);
    //   ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    //   ctx.closePath();
    //   ctx.stroke();
    // }
  }

  async render(waveform: WaveformData, zoom: number, pan: number) {
    const resampled = waveform.resample({
      scale: waveform.scale + ZOOM_FAC * (zoom ** 2 - 1),
    });
    this._draw(resampled, Math.round(pan), zoom !== this._lastZoom);
    this._lastZoom = zoom;
  }
}
