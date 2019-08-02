import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Wave } from '../Wave';


@customElement(SElement.waveSidebar)
export class WaveSidebar extends Sidebar {

  wave?: Wave;

  heading = 'Wave Settings';

  private _ctx = document.querySelector(SElement.app)!.context


  get _contents() {
    if (!this.wave) return null;
    const wave = this.wave.output;

    return html`<form>
      <div class="form-row">
        <label>Type</label>
        <select @change=${(e: any) => this.wave!.type = e.target.value}>
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
          value=${wave.delay}
          @change=${this._updateValue('delay')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Attack </label>
        <synthia-dial
          min="0"
          max="10"
          value=${wave.attack}
          @change=${this._updateValue('attack')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Attack Level </label>
        <synthia-dial
          min="0"
          max="1"
          value=${wave.attackLevel}
          @change=${this._updateValue('attackLevel')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Decay </label>
        <synthia-dial
          min="0"
          max="20"
          value=${wave.decay}
          @change=${this._updateValue('decay')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Decay Level </label>
        <synthia-dial
          min="0"
          max="1"
          value=${wave.decayLevel}
          @change=${this._updateValue('decayLevel')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Release </label>
        <synthia-dial
          min="0"
          max="20"
          value=${wave.release}
          @change=${this._updateValue('release')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Pitch </label>
        <synthia-dial
          min="-24"
          max="24"
          value=${wave.pitch}
          @change=${this._updateValue('pitch')}
        /></synthia-dial>
      </div>

      <div class="form-col">
        <label> Gain </label>
        <synthia-dial
          min="0"
          max="1"
          value=${wave.gain.value}
          @change=${(e: any) => wave.gain.linearRampToValueAtTime(e.target.value, this._ctx.currentTime + 0.05)}
        /></synthia-dial>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.wave.output[prop] = parseFloat(e.target.value);
      this.requestUpdate();
      this.wave!.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.waveSidebar]: WaveSidebar;
  }
}
