import {ESynthiaProjectSynthNodeWave} from '@synthia/api';

import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Wave } from '../Wave';


@customElement(SElement.waveSidebar)
export class WaveSidebar extends Sidebar {

  wave?: Wave;

  heading = 'Wave Settings';

  get _contents() {
    if (!this.wave) return null;
    const sn = this.wave.synthNode!.properties;

    return html`<form>
      <div class="form-row">
        <label>Type</label>
        <select @change=${(e: any) => this.wave!.synthNode!.properties.type = e.target.value}>
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Saw Tooth</option>
        </select>
      </div>

      <div class="form-col">
        <label> Attack </label>
        <s-dial
          min="0"
          max="10"
          value=${sn.attack}
          @change=${this._updateValue('attack')}
        /></s-dial>
      </div>

      <div class="form-col">
        <label> Decay </label>
        <s-dial
          min="0"
          max="20"
          value=${sn.decay}
          @change=${this._updateValue('decay')}
        /></s-dial>
      </div>

      <div class="form-col">
        <label> Release </label>
        <s-dial
          min="0"
          max="20"
          value=${sn.release}
          @change=${this._updateValue('release')}
        /></s-dial>
      </div>

      <div class="form-col">
        <label> Pitch </label>
        <s-dial
          min="-24"
          max="24"
          value=${sn.pitch}
          @change=${this._updateValue('pitch')}
        /></s-dial>
      </div>
    </form>`;
  }


  private _updateValue(prop: Exclude<keyof ESynthiaProjectSynthNodeWave['properties'], 'type'>) {
    return (e: any) => {
      this.wave!.synthNode!.properties[prop] = parseFloat(e.target.value);
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.waveSidebar]: WaveSidebar;
  }
}
