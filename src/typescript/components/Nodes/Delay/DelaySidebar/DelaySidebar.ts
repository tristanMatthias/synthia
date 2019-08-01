import { customElement, LitElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import styles from './delay-sidebar.styles';
import { Delay } from '../Delay';


@customElement(SElement.delaySidebar)
export class DelaySidebar extends LitElement {

  static get styles() {
    return [styles]
  }

  delay?: Delay;


  render() {
    if (!this.delay) return html``;

    return html`<synthia-sidebar>
      <span slot="header">Delay settings</span>
      <form>
        <div class="form-row">
          <label>Delay Time</label>
          <synthia-slider
            type="range"
            min="0"
            max="10"
            value=${this.delay.delayTime}
            @change=${this._updateValue('delayTime')}
          /></synthia-slider>
          <span class="value">${this.delay.delayTime}s</span>
        </div>
        <div class="form-row">
          <label>Feedback</label>
          <synthia-slider
            type="range"
            min="0"
            max="1"
            value=${this.delay.feedback}
            @change=${this._updateValue('feedback')}
          /></synthia-slider>
          <span class="value">${this.delay.feedback}s</span>
        </div>

    </synthia-sidebar>
  `;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.delay![prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.delaySidebar]: DelaySidebar;
  }
}
