import { customElement, html } from 'lit-element';

import { SynthiaFileSynthNodeWave } from '../../../../lib/File/file.type';
import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Wave } from '../Wave';


@customElement(SElement.waveSidebar)
export class WaveSidebar extends Sidebar {

  wave?: Wave;

  heading = 'Wave Settings';

  get _contents() {
    if (!this.wave) return null;
    const model = this.wave.model!.properties;

    return html`<form>
      <div class="form-row">
        <label>Type</label>
        <select @change=${(e: any) => this.wave!.model!.properties.type = e.target.value}>
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Saw Tooth</option>
        </select>
      </div>
      <div class="form-col">
        <label> Delay </label>
        <synthia-dial
          min="0"
          max="5"
          value=${model.delay}
          @change=${this._updateValue('delay')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Attack </label>
        <synthia-dial
          min="0"
          max="10"
          value=${model.attack}
          @change=${this._updateValue('attack')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Attack Level </label>
        <synthia-dial
          min="0"
          max="1"
          value=${model.attackLevel}
          @change=${this._updateValue('attackLevel')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Decay </label>
        <synthia-dial
          min="0"
          max="20"
          value=${model.decay}
          @change=${this._updateValue('decay')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Decay Level </label>
        <synthia-dial
          min="0"
          max="1"
          value=${model.decayLevel}
          @change=${this._updateValue('decayLevel')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Release </label>
        <synthia-dial
          min="0"
          max="20"
          value=${model.release}
          @change=${this._updateValue('release')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Pitch </label>
        <synthia-dial
          min="-24"
          max="24"
          value=${model.pitch}
          @change=${this._updateValue('pitch')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Gain </label>
        <synthia-dial
          min="0"
          max="1"
          value=${model.gain}
          @change=${this._updateValue('gain')}
        /></synthia-dial>
      </div>
    </form>`;
  }


  private _updateValue(prop: Exclude<keyof SynthiaFileSynthNodeWave['properties'], 'type'>) {
    return (e: any) => {
      this.wave!.model!.properties[prop] = parseFloat(e.target.value);
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.waveSidebar]: WaveSidebar;
  }
}
