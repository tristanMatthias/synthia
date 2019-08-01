import { customElement, LitElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import styles from './pan-sidebar.styles';
import { Pan } from '../Pan';


@customElement(SElement.panSidebar)
export class PanSidebar extends LitElement {

  static get styles() {
    return [styles]
  }

  pan?: Pan;

  render() {
    if (!this.pan) return html``;
    return html`<synthia-sidebar>
      <span slot="header">Pan settings</span>
      <form>
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
    </synthia-sidebar>
  `;
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
