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


  @property({ reflect: true })
  color?: string;

  @property({ reflect: true })
  width: number = 800;

  @property({ reflect: true })
  height: number = 600;

  @property({ reflect: true, type: Boolean })
  frequencies: boolean = false;

  @property({ reflect: true, type: Boolean })
  decibels: boolean = false;



  private _canvasCtx?: CanvasRenderingContext2D;
  private _dbScale: number = 60;
  private _ocavtes: number = 11;

  constructor() {
    super();
    this._draw = this._draw.bind(this);
  }

  @query('canvas')
  canvas?: HTMLCanvasElement;


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
    return html`<canvas width="${this.width}px" height="${this.height}px"></canvas>`;
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

  updated() {
    this.style.width = `${this.width}px`;
    this.style.height = `${this.height}px`;
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


    // Draw frequency scale.
    ctx.beginPath();
    for (var octave = 0; octave <= this._ocavtes; octave++) {
      var x = Math.floor(octave * width / this._ocavtes);

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 2;
      ctx.moveTo(x, this.frequencies ? 30 : 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      var f = nyquist * Math.pow(2.0, octave - this._ocavtes);
      var value = f.toFixed(0);
      var unit = 'Hz';
      if (f > 1000) {
        unit = 'KHz';
        value = (f / 1000).toFixed(1);
      }
      if (this.frequencies)  {
        if (octave == 0) ctx.textAlign = 'start';
        else if (octave == this._ocavtes) ctx.textAlign = 'end';
        else ctx.textAlign = "center";
        ctx.lineWidth = 1;
        ctx.strokeStyle = textColor;
        ctx.fillStyle = textColor;
        ctx.fillText(value + unit, x, 20);
      }
    }


    // Draw decibel scale.
    for (var db = -this._dbScale; db < this._dbScale - 10; db += 10) {
      var y = this._dbToY(db);

      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      if (this.decibels) {
        ctx.fillStyle = textColor;
        ctx.textAlign = 'end';
        ctx.fillText(db.toFixed(0) + "dB", width - 4, y - 7);
      }
    }

    // Draw 0dB line.
    ctx.strokeStyle = midColor;
    ctx.beginPath();
    ctx.moveTo(0, 0.5 * height);
    ctx.lineTo(width, 0.5 * height);
    ctx.stroke();


    // Get response
    for (let i = 0; i < width; ++i) {
      let f = i / width;
      // Convert to log frequency scale (octaves).
      f = nyquist * Math.pow(2.0, this._ocavtes * (f - 1.0));
      frequencyHz[i] = f;
    }

    // Draw response.
    this.filter.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (var i = 0; i < width; ++i) {
      const response = magResponse[i];
      const dbResponse = 20.0 * Math.log(response) / Math.LN10;

      const x = Math.floor(i);
      const y = this._dbToY(dbResponse);


      if (i == 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
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
