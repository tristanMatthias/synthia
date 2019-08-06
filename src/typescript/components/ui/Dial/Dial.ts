import color from 'color';
import { customElement, html, LitElement, property, query } from 'lit-element';

import { SElement } from '../../../types';
import styles from './dial.styles';
import { pxToRem, remToPx } from '../../../lib/pxToRem';
import { AppEvents } from '../../layout/App/App';

@customElement(SElement.dial)
export class Dial extends LitElement {

  @property({type: Number})
  min: number = 0;

  @property({type: Number})
  max: number = 1;

  @property({type: Number})
  _value: number = 0.5;
  public get value() : number {
    return this._value;
  }
  public set value(v : number) {
    this._value = v;

    if (this._value < this.min) this._value = this.min;
    if (this._value > this.max) this._value = this.max;

    this._draw();
    this.dispatchEvent(new CustomEvent('change', {
      detail: this._value
    }))
  }


  static get styles() {
    return [styles]
  }

  private _size: number = 8;
  private _offsetDeg = 40;
  private _maxAngle = 270;

  @query('canvas')
  private _canvas?: HTMLCanvasElement;
  @query('span')
  private _handle?: HTMLSpanElement;

  private readonly _app = document.querySelector(SElement.app)!;

  constructor() {
    super();
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleDrag = this._handleDrag.bind(this);
  }

  firstUpdated(props: Map<string, keyof Dial>) {
    super.firstUpdated(props);
    this._canvas!.addEventListener('mousedown', this._handleMouseDown);
    this._draw();
    this._app.addEventListener(AppEvents.redraw, () => {
      this.requestUpdate();
    });
  }

  updated(props: Map<keyof Dial, any>) {
    super.updated(props);
    this._draw();
  }

  render() {
    return html`
      <canvas width="${remToPx(this._size)}px" height="${remToPx(this._size)}px"></canvas>
      <span></span>
      <input .value=${this.value} @change=${(e: any) => this.value = e.target.value}/>
    `;
  }

  private _handleMouseDown(e: MouseEvent) {
    window.addEventListener('mousemove', this._handleDrag);
    window.addEventListener('mouseup', this._handleMouseUp);
  }

  private _handleMouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', this._handleDrag);
    window.removeEventListener('mouseup', this._handleMouseUp);
  }

  private _handleDrag(e: MouseEvent) {
    const {left, width, top, height} = this.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const angleRad = Math.atan((y - e.clientY) / (x - e.clientX));
    let angleDeg = angleRad * 180 / Math.PI;

    if (x >= e.clientX) angleDeg += 180;
    angleDeg -= this._offsetDeg + 90
    if (angleDeg < 0) angleDeg += 360;

    if (angleDeg > 320) angleDeg = 0;
    if (angleDeg > this._maxAngle) angleDeg = this._maxAngle;

    const v = this.min + ((angleDeg / this._maxAngle) * (this.max - this.min));

    this.value = Math.round(v * 1000) / 1000;
  }


  private _draw() {
    const perc = (this._value - this.min) /(this.max - this.min)
    const size = remToPx(this._size);
    const ctx = this._canvas!.getContext('2d')!;
    const lineWidth = 4;
    const start = (180 - this._offsetDeg) / (180 / Math.PI);
    const end = (360 + this._offsetDeg) / (180 / Math.PI);

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, start, end);
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-main');;
    ctx.stroke();


    // Halfway between
    // Percentage of different, plus the start offset
    let lineEnd = ((end - start) * perc) + start;

    const emptyColor = color(getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim());
    const fullColor = color(getComputedStyle(document.documentElement).getPropertyValue('--color-alt').trim());
    let col = emptyColor.mix(color(fullColor), perc);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, start, lineEnd);
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    ctx.strokeStyle = col.rgb().string();
    ctx.stroke();

    this._handle!.style.transform = `rotate(${perc * this._maxAngle - 90 - this._offsetDeg}deg)`;
  }
}
