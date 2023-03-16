import type SpectrogramData from './spectrogram-data';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  render(data: SpectrogramData, channel: number) {
    const spectrogram = data.channelData(channel);
    const step = data.windowSize / 2;
    const buffer = spectrogram.buffer;
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error initializing spectrogram canvas');
    }

    const pixelsPerWindow = this.canvas.width / spectrogram.windows;
    const pixelsPerBin = this.canvas.height / spectrogram.bins;

    let value: number;
    for (let x = 0; x < spectrogram.windows; x++) {
      for (let y = 0; y < spectrogram.bins; y++) {
        value = (buffer[x * step + y] / 10 + 1) * 255;

        const xPos = x * pixelsPerWindow;
        const yPos = this.canvas.height - y * pixelsPerBin;

        ctx.fillStyle = `rgb(${value} ${value} ${value})`;
        ctx.fillRect(xPos, yPos, pixelsPerWindow, pixelsPerBin);
      }
    }
  }
}
