import { customElement, html, property } from 'lit-element';

import { SElement } from '../../types';
import { Slider } from '../Slider/Slider';


@customElement(SElement.expoSlider)
export class ExpoSlider extends Slider {
  @property()
  private _showValue?: number;

  private _minPos = 0;
  private _maxPos = 1;
  private get _minVal() {
    const v = Math.log(this.min);
    if (v < 0) return 0;
    else return v
  }
  private get _maxVal() { return Math.log(this.max); }

  private get _scale() {
    return (this._maxVal - this._minVal) / (this._maxPos - this._minPos)
  }

  render() {
    const left = `${(this._showValue || 0 / 1) * 100}%`;
    return html`<span class="slide" style="left: ${left}"></span>`;
  }

  private _value(perc: number) {
    return Math.exp((perc - this._minPos) * this._scale + this._minVal);
  }
  private _percent(value: number) {
    return this._minPos + (Math.log(value) - this._minVal) / this._scale;
  }

  connectedCallback() {
    super.connectedCallback();
    this._showValue = this._percent(this.value || 0);
  }


  protected _update(e: MouseEvent) {
    const box = this.getBoundingClientRect();
    const relative = e.clientX - box.left;

    let perc = relative / box.width;
    if (perc > 1) perc = 1;
    if (perc < 0) perc = 0;

    this._showValue = perc;
    this.value = this._value(perc);
  }

  updated(props: Map<any, any>) {
    super.updated(props);
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.expoSlider]: ExpoSlider;
  }
}
