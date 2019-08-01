import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Pan } from '../Pan';


@customElement(SElement.panSidebar)
export class PanSidebar extends Sidebar {

  pan?: Pan;

  heading = 'Pan Settings'

  get _contents() {
    if (!this.pan) return null;
    return html`<form>
      <div class="form-row">
        <label>Pan</label>
        <synthia-slider
          type="range"
          min="-1"
          max="1"
          value=${this.pan.pan}
          @change=${this._updateValue('pan')}
        /></synthia-slider>
        <span class="value">${this.pan.pan}</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.pan![prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.panSidebar]: PanSidebar;
  }
}
