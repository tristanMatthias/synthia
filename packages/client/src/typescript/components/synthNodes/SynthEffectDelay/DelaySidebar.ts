import { customElement, html } from 'lit-element';

import { SElement } from '../../../types';
import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { Delay } from './Delay';
import { NodeSidebar } from '../SynthBaseEffect/BaseEffect';


@customElement(SElement.delaySidebar)
export class DelaySidebar extends Sidebar implements NodeSidebar {

  input?: Delay;

  heading = 'Delay Settings'


  get _contents() {
    if (!this.input) return null;
    const props = this.input.model!.properties;

    return html`<form>
      <div class="form-row">
        <label>Delay Time</label>
        <synthia-slider
          type="range"
          min="0"
          max="10"
          value=${props.delayTime}
          @change=${this._updateValue('delayTime')}
        /></synthia-slider>
        <span class="value">${props.delayTime}s</span>
      </div>
      <div class="form-row">
        <label>Feedback</label>
        <synthia-slider
          type="range"
          min="0"
          max="1"
          value=${props.feedback}
          @change=${this._updateValue('feedback')}
        /></synthia-slider>
        <span class="value">${props.feedback}s</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.input!.model.properties[prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.delaySidebar]: DelaySidebar;
  }
}
