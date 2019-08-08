import { customElement, html } from 'lit-element';

import { SElement } from '../../../types';
import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { NodeSidebar } from '../SynthBaseEffect/BaseEffect';
import { Pan } from './Pan';

@customElement(SElement.panSidebar)
export class PanSidebar extends Sidebar implements NodeSidebar {

  input?: Pan;

  heading = 'Pan Settings';

  get _contents() {
    if (!this.input) return null;
    const props = this.input.model!.properties;

    return html`<form>
      <div class="form-row">
        <label>Pan</label>
        <synthia-slider
          type="range"
          min="-1"
          max="1"
          value=${props.pan}
          @change=${this._updateValue('pan')}
        /></synthia-slider>
        <span class="value">${props.pan}</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.input!.model!.properties[prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.panSidebar]: PanSidebar;
  }
}
