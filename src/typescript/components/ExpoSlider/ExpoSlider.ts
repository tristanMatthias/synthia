import { customElement, html, property } from 'lit-element';

import { SElement } from '../../types';
import { Slider } from '../Slider/Slider';


@customElement(SElement.expoSlider)
export class ExpoSlider extends Slider {
  @property()
  private _showValue: number = 0;

  render() {
    const left = `${(this._showValue / 1) * 100}%`;
    return html`<span class="slide" style="left: ${left}"></span>`;
  }

  protected _update(e: MouseEvent) {
    const box = this.getBoundingClientRect();

    var minp = 0;
    var maxp = 1;

    const relative = e.clientX - box.left;

    let perc = relative / box.width;
    if (perc > 1) perc = 1;
    if (perc < 0) perc = 0;
    this._showValue = perc;

    var minv = Math.log(this.min);
    if (minv < 0) minv = 0;
    var maxv = Math.log(this.max);
    var scale = (maxv - minv) / (maxp - minp);


    const exp = Math.exp(minv + scale * (perc - minp));
    this.value = exp;
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.expoSlider]: ExpoSlider;
  }
}
