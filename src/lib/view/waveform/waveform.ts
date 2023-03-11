import { WAVEFORM_BASE_SAMPLES_PER_PIXEL, ZOOM_FAC } from '$lib/util/constants';
import WaveformData from 'waveform-data';

export default class WaveformRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  private _waveform: Promise<WaveformData> | null = null;
  private _lastZoom = 0;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  private _scaleHeight(amplitude: number, height: number) {
    const range = 256;
    const offset = 128;

    return height - ((amplitude + offset) * height) / range;
  }

  private _draw(data: WaveformData, offset: number, cache: boolean) {
    if (cache) {
      this.offscreenCanvas.width = data.length;
      this.offscreenCanvas.height = this.canvas.height;

      const ctx = this.offscreenCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Error intializing waveform canvas');
      }

      ctx.clearRect(
        0,
        0,
        this.offscreenCanvas.width,
        this.offscreenCanvas.height,
      );

      ctx.beginPath();

      ctx.fillStyle = 'rgb(20 184 166)';
      const channel = data.channel(0);

      for (let x = 0; x < data.length; x++) {
        const val = channel.max_sample(x);

        ctx.lineTo(
          x + 0.5,
          this._scaleHeight(val, this.offscreenCanvas.height) + 0.5,
        );
      }

      for (let x = data.length - 1; x >= 0; x--) {
        const val = channel.min_sample(x);

        ctx.lineTo(
          x + 0.5,
          this._scaleHeight(val, this.offscreenCanvas.height) + 0.5,
        );
      }

      ctx.closePath();
      ctx.fill();
    }

    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing waveform canvas');
    }

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.offscreenCanvas, -offset, 0);

    if (data.length - offset < this.canvas.width) {
      ctx.strokeStyle = 'rgb(20 184 166)';
      ctx.beginPath();
      ctx.moveTo(data.length - offset - 1, this.canvas.height / 2);
      ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      ctx.closePath();
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
      const resampled = waveform.resample({
        scale: waveform.scale + ZOOM_FAC * (zoom ** 2 - 1),
      });
      this._draw(resampled, Math.round(pan), zoom !== this._lastZoom);
      this._lastZoom = zoom;
    });
  }
}
