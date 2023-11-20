import { WAVEFORM_BASE_SAMPLES_PER_PIXEL, ZOOM_FAC } from '$lib/util/constants';
import type WaveformData from 'waveform-data';

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

  private _draw(data: WaveformData, channel: number, offset: number) {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing waveform canvas');
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();

    ctx.fillStyle = 'rgb(20 184 166)';
    const channelData = data.channel(channel);

    const len = Math.min(data.length - offset, this.canvas.width);

    for (let x = 0; x < len; x++) {
      const val = channelData.max_sample(x + offset);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    for (let x = len - 1; x >= 0; x--) {
      const val = channelData.min_sample(x + offset);

      ctx.lineTo(x + 0.5, this._scaleHeight(val, this.canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.fill();

    if (data.length - offset < this.canvas.width) {
      ctx.strokeStyle = 'rgb(20 184 166)';
      ctx.beginPath();
      ctx.moveTo(data.length - offset - 1, this.canvas.height / 2);
      ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  async render(
    waveform: WaveformData,
    channel: number,
    zoom: number,
    pan: number,
  ) {
    const resampled = waveform.resample({
      scale: zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL,
    });
    this._draw(resampled, channel, Math.round(pan));
    this._lastZoom = zoom;
  }
}
