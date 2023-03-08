import type { Mutable } from '$lib/util/types';
import decimal from 'decimal.js';
import { zoom, pan } from '$lib/stores';
import {
  HORIZONTAL_TICKER_PADDING,
  WAVEFORM_BASE_SAMPLES_PER_PIXEL,
} from '$lib/util/constants';
import { get } from 'svelte/store';

export type TickerConfig = {
  containerWidth: number;
  sampleRate: number;
  containerPadding?: number;
  samplesPerPixel?: number;
};

// TOOD: Clean this up!
export default class Ticker {
  private _pan = new decimal(0);
  private _time = new decimal(0);
  private _tf: decimal;
  private _cw: decimal;
  private _cp: decimal;

  private _gotPanInitial = false;
  private _gotZoomInitial = false;

  readonly marks: [number, number | null][] | null;

  constructor(config: TickerConfig) {
    const values = {
      containerPadding: HORIZONTAL_TICKER_PADDING,
      samplesPerPixel: WAVEFORM_BASE_SAMPLES_PER_PIXEL,
      ...config,
    };

    this.marks = [];

    this._cw = new decimal(values.containerWidth);
    this._cp = new decimal(values.containerPadding);
    this._tf = this._cw
      .minus(this._cp)
      .times(values.samplesPerPixel)
      .div(values.sampleRate);
    this._time = this._tf.times(get(zoom));
    this._pan = this._time.div(this._cw.minus(this._cp)).times(get(pan));

    pan.subscribe((pan) => {
      if (!this._gotPanInitial) {
        this._gotPanInitial = true;
        return;
      }

      this._pan = this._time.div(this._cw.minus(this._cp)).times(pan);
      this._calc();
    });

    zoom.subscribe((zoom) => {
      if (!this._gotZoomInitial) {
        this._gotZoomInitial = true;
        return;
      }

      this._time = this._tf.times(zoom);
      this._calc();
    });

    this._calc();
  }

  private _calc() {
    const mutableThis = this as Mutable<Ticker>;

    const t = this._time;

    const sp = t.div(this._cw.minus(this._cp));
    const ps = this._cw.minus(this._cp).div(t);
    const p = decimal.pow(10, decimal.floor(decimal.log10(t)).minus(1));

    const min = this._pan.minus(sp.times(this._cp));
    const max = t.plus(this._pan);

    let s: decimal;
    let fac: 2 | 5;

    if (decimal.abs(t.minus(p)).lessThan(decimal.abs(t.minus(p.mul(5))))) {
      s = p.div(2);
      fac = 2;
    } else {
      s = p;
      fac = 5;
    }

    const st = min.toNearest(s);
    const stf = min.toNearest(s.times(fac));

    let l = st;
    let v = st.minus(min).mul(ps);

    mutableThis.marks = [];

    const j = st.minus(stf).divToInt(s).toNumber();

    for (let i = j; l.lessThanOrEqualTo(max); i++) {
      mutableThis.marks.push([
        v.toNumber(),
        i % fac === 0 ? l.toNumber() : null,
      ]);
      v = v.plus(s.times(ps));
      l = l.plus(s);
    }
  }
}
