import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Filter } from '../Filter';


@customElement(SElement.filterSidebar)
export class FilterSidebar extends Sidebar {

  filter?: Filter;

  heading = 'Filter Settings';

  get _contents() {
    if (!this.filter) return null;
    const sn = this.filter.synthNode!.properties;

    return html`
      <s-frequency-response
        .filter=${this.filter.audioNode}
        width="318"
        height="200"
        decibels
      ></s-frequency-response>

      <form>
        <div class="form-row">
          <label>Type</label>
          <select @change=${this._updateValue('type')} .value=${sn.type}>
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
          <s-expo-slider
            type="range"
            min="0"
            max="24000"
            value=${sn.frequency}
            @change=${this._updateValue('frequency')}
          /></s-expo-slider>
          <span class="value">${Math.floor(sn.frequency)}hz</span>
        </div>

        <div class="form-row">
          <label>Quality (Q)</label>
          <s-slider
            type="range"
            min="0"
            max="20"
            value=${sn.Q}
            @change=${this._updateValue('Q')}
          /></s-slider>
          <span class="value">${Math.floor(sn.Q)}db</span>
        </div>


        <div class="form-row">
          <label>Gain</label>
          <s-slider
            type="range"
            min="0"
            max="5"
            value=${sn.gain}
            @change=${this._updateValue('gain')}
          /></s-slider>
          <span class="value">${Math.floor(sn.gain)}</span>
        </div>
      </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.filter!.synthNode!.properties[prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.filterSidebar]: FilterSidebar;
  }
}
