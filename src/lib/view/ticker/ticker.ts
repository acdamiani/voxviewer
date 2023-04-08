import decimal from 'decimal.js';
import {
  TICKER_PIXEL_SPACING,
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
      padding: 0,
      ...config,
    };

    this._canvas = values.canvas;
    this._padding = values.padding;
    this._sampleRate = values.sampleRate;
  }

  private _niceStep(seconds: decimal.Value): {
    step: decimal;
    factor: 1 | 2 | 5 | 10;
  } {
    seconds = new decimal(seconds);
    const exp = decimal.floor(decimal.log10(seconds));
    const frac = seconds.div(decimal.pow(10, exp));

    let niceFrac: decimal;
    let factor: 1 | 2 | 5 | 10;

    if (frac.lte(1)) {
      niceFrac = new decimal(1);
      factor = 1;
    } else if (frac.lte(2)) {
      niceFrac = new decimal(2);
      factor = 2;
    } else if (frac.lte(5)) {
      niceFrac = new decimal(5);
      factor = 5;
    } else {
      niceFrac = new decimal(10);
      factor = 10;
    }

    return {
      step: decimal.pow(10, exp).mul(niceFrac).div(factor),
      factor,
    };
  }

  render(zoom: number, pan: number) {
    const width = new decimal(this._canvas.width);
    const padding = new decimal(this._padding);
    const widthNoPadding = width.sub(padding);
    const samplesPerPixel = new decimal(WAVEFORM_BASE_SAMPLES_PER_PIXEL * zoom);
    const samples = widthNoPadding.mul(samplesPerPixel);
    const sampleRate = new decimal(this._sampleRate);

    const extent = samples.div(this._sampleRate);
    const pixelsPerSecond = sampleRate.div(samplesPerPixel);
    const secondsPerPixel = samplesPerPixel.div(sampleRate);
    const tickerPan = samplesPerPixel.mul(pan).div(sampleRate);
    const min = tickerPan.sub(padding.mul(samplesPerPixel).div(sampleRate));
    const max = tickerPan.plus(extent);

    const { step, factor } = this._niceStep(
      secondsPerPixel.mul(TICKER_PIXEL_SPACING),
    );

    const pixelStep = step.mul(pixelsPerSecond);

    const startingTicker = min.toNearest(step);
    const startingSigTicker = min.toNearest(step.times(factor));

    let time = startingTicker;
    let position = startingTicker.sub(min).mul(pixelsPerSecond);

    const significantOffset = startingSigTicker
      .sub(startingTicker)
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
      sig = i % factor === 0;
      x = decimal.round(position).toNumber();

      const height = sig ? 18 : 8;

      ctx.fillStyle = sig ? 'rgb(113 113 122)' : 'rgb(39 39 42)';
      ctx.fillRect(x - 1, this._canvas.height - height, 2, height);

      if (sig) {
        ctx.fillText(time.toString(), x + 14, this._canvas.height - height + 8);
      }

      time = time.plus(step);
      position = position.plus(pixelStep);
    }
  }
}
