import { html, LitElement, query, property } from 'lit-element';

import { SElement } from '../../types';
import styles from './frequency-response.styles';


export class FrequencyResponse extends LitElement {
  static get styles() {
    return [styles]
  }

  private _app = document.querySelector(SElement.app)!;
  private _ctx = this._app.context;

  filter?: BiquadFilterNode;

  private _canvasCtx?: CanvasRenderingContext2D;
  private _dbScale: number = 60;
  private _ocavtes: number = 11;

  constructor() {
    super();
    this._draw = this._draw.bind(this);
    this.filter = this._ctx.createBiquadFilter();
    this.filter.Q.value = 5;
    this.filter.frequency.value = 2000;
    this.filter.gain.value = 0.4;
    this.filter.connect(this._ctx.destination);

    const osc = this._ctx.createOscillator();
    osc.type = 'square';
    osc.connect(this.filter);
    osc.start();
  }

  @query('canvas')
  canvas?: HTMLCanvasElement;


  @property({reflect: true})
  color?: string;

  @property({reflect: true})
  width: number = 800;

  @property({reflect: true})
  height: number = 600;


  private _frequency: number = 100;
  get frequency() {
    return this._frequency;
  }
  set frequency(v: number) {
    this._frequency = v;
    if (this.filter) this.filter.frequency.setValueAtTime(v, this._ctx.currentTime);
    this.requestUpdate();
  }

  private get _pixelsPerDb() {
    return 0.5 * this.height / this._dbScale;
  }

  render() {
    return html`
      <canvas width="${this.width}px" height="${this.height}px"></canvas>
      <synthia-expo-slider type="range" value="0" max="24000" @change=${(e: any) => this.frequency = e.target.value} />
      </synthia-expo-slider>
      ${this.frequency}
    `;
  }

  firstUpdated() {
    const c = this.canvas!;
    var dpr = window.devicePixelRatio || 1;
    c.width = this.width * dpr;
    c.height = this.height * dpr;
    c.style.width = `${this.width}px`;
    c.style.height = `${this.height}px`;

    this._canvasCtx = c.getContext('2d')!;
    this._canvasCtx.font = '1.2rem Space Mono';
    this._canvasCtx.scale(dpr, dpr);
    this._draw();
  }

  private _draw() {
    window.requestAnimationFrame(this._draw);
    if (!this.filter) return;


    const ctx = this._canvasCtx!;
    const width = this.width - 1;
    const height = this.height - 1;

    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg');
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--color-dark');
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--color-alt');
    const midColor = getComputedStyle(document.documentElement).getPropertyValue('--color-feature');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, this.width, this.height);

    const frequencyHz = new Float32Array(width);
    const magResponse = new Float32Array(width);
    const phaseResponse = new Float32Array(width);
    const nyquist = 0.5 * this._ctx.sampleRate;

    // First get response.
    for (let i = 0; i < width; ++i) {
      let f = i / width;
      // Convert to log frequency scale (octaves).
      f = nyquist * Math.pow(2.0, this._ocavtes * (f - 1.0));
      frequencyHz[i] = f;
    }

    this.filter.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (var i = 0; i < width; ++i) {
      // const f = magResponse[i];
      const response = magResponse[i];
      const dbResponse = 20.0 * Math.log(response) / Math.LN10;

      const x = Math.floor(i);
      const y = this._dbToY(dbResponse);


      if (i == 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.beginPath();

    // Draw frequency scale.
    for (var octave = 0; octave <= this._ocavtes; octave++) {
      var x = Math.floor(octave * width / this._ocavtes);

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 2;
      ctx.moveTo(x, 30);
      ctx.lineTo(x, height);
      ctx.stroke();

      var f = nyquist * Math.pow(2.0, octave - this._ocavtes);
      var value = f.toFixed(0);
      var unit = 'Hz';
      if (f > 1000) {
        unit = 'KHz';
        value = (f / 1000).toFixed(1);
      }
      if (octave == 0) ctx.textAlign = 'start';
      else if (octave == this._ocavtes) ctx.textAlign = 'end';
      else ctx.textAlign = "center";
      ctx.lineWidth = 1;
      ctx.strokeStyle = textColor;
      ctx.fillStyle = textColor;
      ctx.fillText(value + unit, x, 20);
    }


    // Draw decibel scale.
    for (var db = -this._dbScale; db < this._dbScale - 10; db += 10) {
      var y = this._dbToY(db);
      ctx.strokeStyle = textColor;
      ctx.fillStyle = textColor;
      ctx.fillText(db.toFixed(0) + "dB", width - 4, y - 8);
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw 0dB line.
    ctx.strokeStyle = midColor;
    ctx.beginPath();
    ctx.moveTo(0, 0.5 * height);
    ctx.lineTo(width, 0.5 * height);
    ctx.stroke();
  }


  private _dbToY(db:number) {
    return Math.floor(0.5 * this.height - this._pixelsPerDb * db);
  }

}

window.customElements.define(SElement.frequencyResponse, FrequencyResponse);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.frequencyResponse]: FrequencyResponse;
  }
}
