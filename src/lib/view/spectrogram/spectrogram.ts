import type AudioFile from '$lib/audio/audio';
import SpectrogramData from './spectrogram-data';
import { generateSpectrogram } from './spectrogram-gen';

export default class SpectrogramRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly offscreenCanvas: HTMLCanvasElement;

  private _spectrogramData: SpectrogramData | null = null;

  constructor(canvas: HTMLCanvasElement, offscreenCanvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.offscreenCanvas = offscreenCanvas;
  }

  render(data: SpectrogramData, channel: number) {}
}
