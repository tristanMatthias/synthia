import { customElement, LitElement, html } from 'lit-element';

import { SElement } from '../../../types';
import styles from './oscillator-sidebar.styles';
import { Oscillator } from '../Oscillator';


@customElement(SElement.oscillatorSidebar)
export class OscillatorSidebar extends LitElement {

  static get styles() {
    return [styles]
  }

  oscillator?: Oscillator;

  private _ctx = document.querySelector(SElement.app)!.context


  render() {
    if (!this.oscillator) return html``;
    const oscillator = this.oscillator.output;

    return html`<synthia-sidebar>
      <span slot="header">Oscillator settings</span>

      <form>
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
          <span class="value">${oscillator.pitch}s</span>
        </div>
      </form>
    </synthia-sidebar>
  `;
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
