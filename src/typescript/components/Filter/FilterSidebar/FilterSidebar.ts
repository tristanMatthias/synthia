import { customElement, LitElement, html } from 'lit-element';

import { SElement } from '../../../types';
import styles from './filter-sidebar.styles';
import { Filter } from '../Filter';


@customElement(SElement.filterSidebar)
export class FilterSidebar extends LitElement {

  static get styles() {
    return [styles]
  }

  filter?: Filter;

  private _ctx = document.querySelector(SElement.app)!.context


  render() {
    if (!this.filter) return html``;
    const filter = this.filter.filter;

    return html`<synthia-sidebar>
      <span slot="header">Filter settings</span>
      <synthia-frequency-response
        .filter=${filter}
        width="318"
        height="200"
        decibels
      ></synthia-frequency-response>

      <form>
        <div class="form-row">
          <label>Type</label>
          <select @change=${this._updateValue('type')}>
            <option value="highpass">High Pass</option>
            <option value="lowpass">Low Pass</option>
            <option value="bandpass">Band Pass</option>
            <option value="allpass">All Pass</option>
            <option value="highshelf">High Shelf</option>
            <option value="lowshelf">Low Shelf</option>
            <option value="peaking">Peaking</option>
            <option value="notch">Notch</option>
          </select>
        </div>

        <div class="form-row">
          <label>Frequency</label>
          <synthia-expo-slider
            type="range"
            value="0"
            max="24000"
            @change=${this._updateValue('frequency')}
          /></synthia-expo-slider>
          <span class="value">${Math.floor(this.filter.frequency)}hz</span>
        </div>

        <div class="form-row">
          <label>Quality (Q)</label>
          <synthia-slider
            type="range"
            value="0"
            max="20"
            @change=${this._updateValue('q')}
          /></synthia-slider>
          <span class="value">${Math.floor(this.filter.q)}db</span>
        </div>


        <div class="form-row">
          <label>Gain</label>
          <synthia-slider
            type="range"
            value="0"
            max="5"
            @change=${this._updateValue('gain')}
          /></synthia-slider>
          <span class="value">${Math.floor(this.filter.gain)}</span>
        </div>
      </form>
    </synthia-sidebar>
  `;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.filter![prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.filterSidebar]: FilterSidebar;
  }
}
