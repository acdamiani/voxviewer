import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';
import type SpectrogramData from './spectrogram-data';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  private async _generateImageData(
    ctx: CanvasRenderingContext2D,
    data: SpectrogramData,
    channel: number,
    zoom: number,
  ) {
    const samplesPerPixel = zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL;

    const spectrogram = data.spectrogram(channel);

    const windows = spectrogram.windows;
    const bins = spectrogram.bins;
    const buffer = spectrogram.buffer;
    const info = spectrogram.info;

    const windowsInView = Math.floor(
      (ctx.canvas.width * samplesPerPixel * 2) / info.windowSize,
    );
    const pxRatio = windowsInView / ctx.canvas.width;
    const ratioedWindows = Math.floor(windows / pxRatio);

    const imageData = ctx.createImageData(
      pxRatio <= 1 ? windowsInView : Math.min(ctx.canvas.width, ratioedWindows),
      Math.min(ctx.canvas.height, bins),
    );

    const fac = [
      imageData.width / Math.min(windows, windowsInView),
      bins / ctx.canvas.height,
    ];

    const pixels = imageData.data;

    let currentWindow: number;
    let currentBin: number;

    let i: number;

    for (let x = 0; x < imageData.width; x++) {
      currentWindow = (x / fac[0]) | 0;

      for (let y = 0; y < imageData.height; y++) {
        currentBin = (y * fac[1]) | 0;

        i =
          (currentWindow * ((info.windowSize * info.zeroPaddingFactor) / 2) +
            currentBin) *
          3;

        const arrOffset = ((imageData.height - y) * imageData.width + x) * 4;
        pixels[arrOffset] = buffer[i];
        pixels[arrOffset + 1] = buffer[i + 1];
        pixels[arrOffset + 2] = buffer[i + 2];
        pixels[arrOffset + 3] = 255;
      }
    }

    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'copy';
    ctx.putImageData(imageData, 0, 0);

    let width = imageData.width;
    if (pxRatio <= 1) {
      ctx.globalCompositeOperation = 'copy';
      width = Math.min(ctx.canvas.width, ratioedWindows);
      ctx.drawImage(
        ctx.canvas,
        0,
        0,
        imageData.width,
        imageData.height,
        0,
        0,
        width,
        ctx.canvas.height,
      );
    }

    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = spectrogram.bg;
    ctx.fillRect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
  }

  async render(
    data: SpectrogramData,
    channel: number,
    zoom: number,
  ): Promise<void> {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        this._generateImageData(ctx, data, channel, zoom);
        resolve();
      });
    });
  }
}
