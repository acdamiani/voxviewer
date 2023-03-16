import { WAVEFORM_BASE_SAMPLES_PER_PIXEL } from '$lib/util/constants';
import type SpectrogramData from './spectrogram-data';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  render(data: SpectrogramData, channel: number, zoom: number) {
    const spectrogram = data.channelData(channel);
    const step = data.windowSize / 2;
    const buffer = spectrogram.buffer;
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const samplesPerPixel = zoom * WAVEFORM_BASE_SAMPLES_PER_PIXEL;
    const pixelsPerWindow = data.windowSize / samplesPerPixel;
    const pixelsPerBin = this.canvas.height / spectrogram.bins;
    const visibleWindows = Math.min(
      Math.ceil(this.canvas.width / pixelsPerWindow),
      spectrogram.windows,
    );

    console.log('samp', samplesPerPixel);
    console.log('windowSize', data.windowSize);
    console.log('pixelsPerWindow', pixelsPerWindow);
    console.log('visibleWindows', visibleWindows);

    const offset = 20;
    const range = 80;

    let value: number;
    for (let x = 0; x < visibleWindows; x++) {
      for (let y = 0; y < spectrogram.bins; y++) {
        value = 255 - ((buffer[x * step + y] + offset) / -range) * 255;

        if (x === 23 && y == 63) {
          console.log(value);
        }

        const xPos = x * pixelsPerWindow;
        const yPos = this.canvas.height - y * pixelsPerBin;

        ctx.fillStyle = `rgb(${value} ${value} ${value})`;
        ctx.fillRect(xPos, yPos, pixelsPerWindow, pixelsPerBin);
      }
    }
  }
}
