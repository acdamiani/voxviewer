import type { Mutable } from '$lib/utli/types';
import decimal from 'decimal.js';

const SECONDS_PER_ZOOM_UNIT = 10;
const ZOOM_FAC = 2;

export default class Ticker {
  private _pan: decimal = new decimal(0);
  private _zoom: decimal = new decimal(0);
  private _cw: decimal = new decimal(0);
  private _cp: decimal = new decimal(0);
  private _time: decimal = new decimal(0);

  readonly marks: [number, number | null][] | null;

  constructor(pan: number, zoom: number, width: number, padding: number) {
    this.marks = [];
    this._zoom = decimal.max(0, zoom);
    this._time = this._zoom.mul(SECONDS_PER_ZOOM_UNIT);

    this.pan(pan);
    this.container(width, padding);

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

  pan(pan: decimal.Value) {
    this._pan = decimal.max(0, this._pan.plus(this._zoom.times(pan)));
    this._calc();
  }

  zoomIn() {
    this._zoom = this._zoom.div(ZOOM_FAC);
    this._time = this._zoom.mul(SECONDS_PER_ZOOM_UNIT);
    this._calc();

    console.log(this._zoom.toNumber());
  }

  zoomOut() {
    this._zoom = this._zoom.mul(ZOOM_FAC);
    this._time = this._zoom.mul(SECONDS_PER_ZOOM_UNIT);
    this._calc();

    console.log(this._zoom.toNumber());
  }

  container(width: number, padding: number) {
    this._cw = decimal.max(0, width);
    this._cp = decimal.max(0, padding);
  }
}
