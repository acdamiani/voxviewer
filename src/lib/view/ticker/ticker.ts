import decimal from 'decimal.js';
import {
  HORIZONTAL_TICKER_PADDING,
  WAVEFORM_BASE_SAMPLES_PER_PIXEL,
} from '$lib/util/constants';

export type TickerConfig = {
  canvas: HTMLCanvasElement;
  sampleRate: number;
  padding?: number;
  samplesPerPixel?: number;
};

export default class Ticker {
  private _canvas: HTMLCanvasElement;

  private _padding: number;
  private _sampleRate: number;

  constructor(config: TickerConfig) {
    const values = {
      padding: HORIZONTAL_TICKER_PADDING,
      ...config,
    };

    this._canvas = values.canvas;
    this._padding = values.padding;
    this._sampleRate = values.sampleRate;
  }

  render(zoom: number, pan: number) {
    const width = new decimal(this._canvas.width);
    const padding = new decimal(this._padding);
    const widthNoPadding = width.minus(padding);
    const samplesPerPixel = WAVEFORM_BASE_SAMPLES_PER_PIXEL * zoom;
    const samples = widthNoPadding.mul(samplesPerPixel);
    const sampleRate = new decimal(this._sampleRate);

    const extent = samples.div(this._sampleRate);
    const pixelsPerSecond = sampleRate.div(samplesPerPixel);
    const tickerPan = new decimal(samplesPerPixel * pan).div(sampleRate);
    const min = tickerPan.minus(padding.mul(samplesPerPixel).div(sampleRate));
    const max = tickerPan.plus(extent);

    let step: decimal;
    let significantFactor: 2 | 5;

    const factor = decimal.pow(
      10,
      decimal.floor(decimal.log10(extent)).minus(1),
    );

    if (
      decimal
        .abs(extent.minus(factor))
        .lessThan(decimal.abs(extent.minus(factor.mul(5))))
    ) {
      step = factor.div(2);
      significantFactor = 2;
    } else {
      step = factor;
      significantFactor = 5;
    }

    const pixelStep = step.mul(pixelsPerSecond);

    const startingTicker = min.toNearest(step);
    const startingSigTicker = min.toNearest(step.times(significantFactor));

    let time = startingTicker;
    let position = startingTicker.minus(min).mul(pixelsPerSecond);

    const significantOffset = startingSigTicker
      .minus(startingTicker)
      .div(step)
      .toNumber();

    const ctx = this._canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Error intializing canvas context');
    }

    ctx.font =
      'bold 12px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    let sig = false;
    let x = 0;

    for (let i = -significantOffset; time.lessThanOrEqualTo(max); i++) {
      sig = i % significantFactor === 0;
      x = decimal.round(position).toNumber();

      ctx.fillStyle = sig ? 'rgb(113 113 122)' : 'rgb(39 39 42)';
      ctx.fillRect(x - 1, 0, 2, sig ? 32 : 8);

      if (sig) {
        ctx.fillText(time.toString(), x, 48);
      }

      time = time.plus(step);
      position = position.plus(pixelStep);
    }
  }
}
