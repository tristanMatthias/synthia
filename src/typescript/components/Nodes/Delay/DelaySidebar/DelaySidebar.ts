import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Delay } from '../Delay';


@customElement(SElement.delaySidebar)
export class DelaySidebar extends Sidebar {

  delay?: Delay;

  heading = 'Delay Settings'


  get _contents() {
    if (!this.delay) return null;

    return html`<form>
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
    </form>`;
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
