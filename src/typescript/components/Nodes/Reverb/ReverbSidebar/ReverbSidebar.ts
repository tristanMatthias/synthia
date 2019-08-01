import { customElement, LitElement, html } from 'lit-element';

import { SElement } from '../../../../types';
import styles from './reverb-sidebar.styles';
import { Reverb } from '../Reverb';


@customElement(SElement.reverbSidebar)
export class ReverbSidebar extends LitElement {

  static get styles() {
    return [styles]
  }

  reverb?: Reverb;

  private _ctx = document.querySelector(SElement.app)!.context


  render() {
    if (!this.reverb) return html``;
    const reverb = this.reverb.reverb;

    return html`<synthia-sidebar>
      <span slot="header">Reverb settings</span>
      <form>
        <div class="form-row">
          <label>Decay Time</label>
          <synthia-slider
            type="range"
            min="0"
            max="60"
            value=${this.reverb.decayTime}
            @change=${this._updateValue('decayTime')}
          /></synthia-slider>
          <span class="value">${Math.floor(this.reverb.decayTime)}s</span>
        </div>

        <div class="form-row">
          <label>Room Size</label>
          <synthia-expo-slider
            type="range"
            min="0"
            max="150000"
            value=${this.reverb.roomSize}
            @change=${this._updateValue('roomSize')}
          /></synthia-expo-slider>
          <span class="value">${Math.floor(this.reverb.roomSize)}hz</span>
        </div>

        <div class="form-row">
          <label>Fade In Time</label>
          <synthia-slider
            type="range"
            min="0"
            max="3"
            value=${this.reverb.fadeInTime}
            @change=${this._updateValue('fadeInTime')}
          /></synthia-slider>
          <span class="value">${Math.floor(this.reverb.fadeInTime)}s</span>
        </div>

        <div class="form-row">
          <label>Dry / Wet</label>
          <synthia-slider
            type="range"
            min="0"
            max="1"
            value=${this.reverb.dryWet}
            @change=${this._updateValue('dryWet')}
          /></synthia-expo-slider>
          <span class="value">${Math.floor(this.reverb.dryWet)}hz</span>
        </div>

    </synthia-sidebar>
  `;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.reverb![prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.reverbSidebar]: ReverbSidebar;
  }
}
