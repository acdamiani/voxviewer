import {
  SPECTROGRAM_CHUNK_SIZE,
  WAVEFORM_BASE_SAMPLES_PER_PIXEL,
} from '$lib/util/constants';
import type { SpectrogramOptions } from './glue';
import type JsSpectrogram from './spectrogram';
import type SpectrogramData from './spectrogram-data';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvases: HTMLCanvasElement[];
  private _spectrogram: JsSpectrogram;
  private _channel: number;
  private _generated: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvases = [];
  }

  // TODO: Put this in a Web Worker
  private _generateImageData(
    parent: Node,
    data: SpectrogramData,
    channel: number,
  ) {
    for (const node of parent.childNodes) {
      const child = node as HTMLElement;

      if (child && child.classList.contains('_ctx')) {
        parent.removeChild(child);
      }
    }

    this.offscreenCanvases.length = 0;

    this._spectrogram = data.spectrogram(channel);
    const imageData = new ImageData(
      SPECTROGRAM_CHUNK_SIZE,
      this._spectrogram.bins,
    );
    const arr = imageData.data;
    const winOffset =
      (this._spectrogram.info.windowSize *
        this._spectrogram.info.zeroPaddingFactor) /
      (this._spectrogram.info.overlap ? 2 : 1);
    const bgCol = this._spectrogram.rgbBackground;

    for (
      let chunk = 0;
      chunk < Math.ceil(this._spectrogram.windows / SPECTROGRAM_CHUNK_SIZE);
      chunk++
    ) {
      const offset = chunk * SPECTROGRAM_CHUNK_SIZE;

      for (let y = 0; y < imageData.height; y++) {
        let x = 0;
        for (
          ;
          x < Math.min(this._spectrogram.windows - offset, imageData.width);
          x++
        ) {
          const ao = ((imageData.height - y) * imageData.width + x) * 4;
          const so = ((x + offset) * winOffset + y) * 3;
          arr[ao] = this._spectrogram.buffer[so];
          arr[ao + 1] = this._spectrogram.buffer[so + 1];
          arr[ao + 2] = this._spectrogram.buffer[so + 2];
          arr[ao + 3] = 255;
        }

        for (; x < imageData.width; x++) {
          const ao = ((imageData.height - y) * imageData.width + x) * 4;
          arr[ao] = bgCol[0];
          arr[ao + 1] = bgCol[1];
          arr[ao + 2] = bgCol[2];
          arr[ao + 3] = 255;
        }
      }

      // Probably not best practice...
      const canvas = document.createElement('canvas');
      canvas.width = SPECTROGRAM_CHUNK_SIZE;
      canvas.height = this._spectrogram.bins;
      canvas.className = '_ctx';

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      ctx.putImageData(imageData, 0, 0);
      parent.appendChild(canvas);
      this.offscreenCanvases.push(canvas);
    }
  }

  private _draw(ctx: CanvasRenderingContext2D, zoom: number, pan: number) {
    const samplesPerPixel = zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL;
    const zoomRatio =
      (samplesPerPixel * (this._spectrogram.info.overlap ? 2 : 1)) /
      this._spectrogram.info.windowSize;
    const chunkSize = SPECTROGRAM_CHUNK_SIZE / zoomRatio;

    let w = -pan,
      i = 0;

    const bg = this._spectrogram.bg;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    while (w < ctx.canvas.width) {
      const canvas = this.offscreenCanvases[i];

      if (!canvas) {
        ctx.fillStyle = bg;
        ctx.fillRect(w, 0, ctx.canvas.width - w, ctx.canvas.height);

        break;
      }

      const offset = -pan + i * chunkSize;

      w += chunkSize;
      i++;

      if (offset + chunkSize < 0) {
        continue;
      }

      ctx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        offset,
        0,
        chunkSize,
        ctx.canvas.height,
      );
    }
  }

  async render(
    data: SpectrogramData,
    channel: number,
    zoom: number,
    pan: number,
  ): Promise<void> {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    if (
      this._channel !== channel ||
      data.spectrogram(channel).id !== this._spectrogram.id
    ) {
      this._generateImageData(this.canvas, data, channel);
      this._channel = channel;
    }

    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        this._draw(ctx, zoom, pan);
        resolve();
      });
    });
  }

  clear() {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    console.log('going');
  }
}
