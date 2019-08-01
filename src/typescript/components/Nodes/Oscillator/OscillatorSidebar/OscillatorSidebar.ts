import { customElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import { Sidebar } from '../../../layout/Sidebar/Sidebar';
import { Oscillator } from '../Oscillator';


@customElement(SElement.oscillatorSidebar)
export class OscillatorSidebar extends Sidebar {

  oscillator?: Oscillator;

  heading = 'Oscillator Settings';

  private _ctx = document.querySelector(SElement.app)!.context


  get _contents() {
    if (!this.oscillator) return null;
    const oscillator = this.oscillator.output;

    return html`<form>
      <div class="form-row">
        <label>Type</label>
        <select @change=${(e: any) => this.oscillator!.type = e.target.value}>
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Saw Tooth</option>
        </select>
      </div>
      <div class="form-row">
        <label> Delay </label>
        <synthia-slider
          type="range"
          min="0"
          max="5"
          value=${oscillator.delay}
          @change=${this._updateValue('delay')}
        /></synthia-slider>
        <span class="value">${oscillator.delay}s</span>
      </div>

      <div class="form-row">
        <label> Attack </label>
        <synthia-slider
          type="range"
          min="0"
          max="10"
          value=${oscillator.attack}
          @change=${this._updateValue('attack')}
        /></synthia-slider>
        <span class="value">${oscillator.attack}s</span>
      </div>

      <div class="form-row">
        <label> Attack Level </label>
        <synthia-slider
          type="range"
          min="0"
          max="1"
          value=${oscillator.attackLevel}
          @change=${this._updateValue('attackLevel')}
        /></synthia-slider>
        <span class="value">${oscillator.attackLevel}</span>
      </div>

      <div class="form-row">
        <label> Decay </label>
        <synthia-slider
          type="range"
          min="0"
          max="20"
          value=${oscillator.decay}
          @change=${this._updateValue('decay')}
        /></synthia-slider>
        <span class="value">${oscillator.decay}s</span>
      </div>

      <div class="form-row">
        <label> Decay Level </label>
        <synthia-slider
          type="range"
          min="0"
          max="1"
          value=${oscillator.decayLevel}
          @change=${this._updateValue('decayLevel')}
        /></synthia-slider>
        <span class="value">${oscillator.decayLevel}</span>
      </div>

      <div class="form-row">
        <label> Release </label>
        <synthia-slider
          type="range"
          min="0"
          max="20"
          value=${oscillator.release}
          @change=${this._updateValue('release')}
        /></synthia-slider>
        <span class="value">${oscillator.release}s</span>
      </div>

      <div class="form-row">
        <label> Pitch </label>
        <synthia-slider
          type="range"
          min="-24"
          max="24"
          value=${oscillator.pitch}
          @change=${this._updateValue('pitch')}
        /></synthia-slider>
        <span class="value">${oscillator.pitch}</span>
      </div>

      <div class="form-row">
        <label> Gain </label>
        <synthia-slider
          type="range"
          min="0"
          max="1"
          value=${oscillator.gain.value}
          @change=${(e: any) => oscillator.gain.linearRampToValueAtTime(e.target.value, this._ctx.currentTime + 0.05)}
        /></synthia-slider>
        <span class="value">${oscillator.gain.value}</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.oscillator.output[prop] = parseFloat(e.target.value);
      this.requestUpdate();
      this.oscillator!.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.oscillatorSidebar]: OscillatorSidebar;
  }
}
