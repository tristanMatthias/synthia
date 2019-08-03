import { customElement, html } from 'lit-element';

import { SElement } from '../../../types';
import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { Delay } from './Delay';
import { NodeSidebar } from '../BaseEffect/BaseEffect';


@customElement(SElement.delaySidebar)
export class DelaySidebar extends Sidebar implements NodeSidebar {

  input?: Delay;

  heading = 'Delay Settings'


  get _contents() {
    if (!this.input) return null;

    return html`<form>
      <div class="form-row">
        <label>Delay Time</label>
        <synthia-slider
          type="range"
          min="0"
          max="10"
          value=${this.input.delayTime}
          @change=${this._updateValue('delayTime')}
        /></synthia-slider>
        <span class="value">${this.input.delayTime}s</span>
      </div>
      <div class="form-row">
        <label>Feedback</label>
        <synthia-slider
          type="range"
          min="0"
          max="1"
          value=${this.input.feedback}
          @change=${this._updateValue('feedback')}
        /></synthia-slider>
        <span class="value">${this.input.feedback}s</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.input![prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.delaySidebar]: DelaySidebar;
  }
}
