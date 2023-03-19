import { WAVEFORM_BASE_SAMPLES_PER_PIXEL, ZOOM_FAC } from '$lib/util/constants';
import type SpectrogramData from './spectrogram-data';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  private _generateImageData(
    ctx: CanvasRenderingContext2D,
    data: SpectrogramData,
    channel: number,
    zoom: number,
  ) {
    const samplesPerPixel =
      WAVEFORM_BASE_SAMPLES_PER_PIXEL + ZOOM_FAC * (zoom ** 2 - 1);

    const channelData = data.channelData(channel);

    const windows = channelData.windows;
    const bins = channelData.bins;
    const buffer = data.channelData(channel).buffer;

    const windowsInView = Math.floor(
      (ctx.canvas.width * samplesPerPixel * 2) / data.windowSize,
    );

    const imageData = ctx.createImageData(
      1 * Math.min(ctx.canvas.width, windowsInView),
      1 * Math.min(ctx.canvas.height, bins),
    );

    const fac = [windowsInView / imageData.width, bins / imageData.height];

    const pixels = imageData.data;

    let currentWindow: number;
    let currentBin: number;

    let i: number;
    for (let x = 0; x < imageData.width; x++) {
      currentWindow = fac[0] <= 1 ? x : Math.floor(x * fac[0]);

      for (let y = 0; y < imageData.height; y++) {
        currentBin = fac[1] <= 1 ? y : Math.floor(y * fac[1]);

        i = (currentWindow * data.windowSize + currentBin) * 3;

        const arrOffset = ((imageData.height - y) * imageData.width + x) * 4;
        pixels[arrOffset] = buffer[i];
        pixels[arrOffset + 1] = buffer[i + 1];
        pixels[arrOffset + 2] = buffer[i + 2];
        pixels[arrOffset + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(
      ctx.canvas,
      0,
      0,
      imageData.width,
      imageData.height,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );
  }

  render(data: SpectrogramData, channel: number, zoom: number) {
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    ctx.imageSmoothingEnabled = false;
    this._generateImageData(ctx, data, channel, zoom);
  }
}
