import { customElement, html } from 'lit-element';

import { SElement } from '../../../types';
import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { NodeSidebar } from '../SynthBaseEffect/BaseEffect';
import { Reverb } from './Reverb';


@customElement(SElement.reverbSidebar)
export class ReverbSidebar extends Sidebar implements NodeSidebar {

  input?: Reverb;
  heading = 'Reverb Settings';

  get _contents() {
    if (!this.input) return null;
    const props = this.input.synthNode!.properties;

    return html`<form>
      <div class="form-row">
        <label>Decay Time</label>
        <s-slider
          type="range"
          min="0"
          max="60"
          value=${props.decayTime}
          @change=${this._updateValue('decayTime')}
        /></s-slider>
        <span class="value">${Math.floor(props.decayTime)}s</span>
      </div>

      <div class="form-row">
        <label>Room Size</label>
        <s-expo-slider
          type="range"
          min="0"
          max="150000"
          value=${props.roomSize}
          @change=${this._updateValue('roomSize')}
        /></s-expo-slider>
        <span class="value">${Math.floor(props.roomSize)}hz</span>
      </div>

      <div class="form-row">
        <label>Fade In Time</label>
        <s-slider
          type="range"
          min="0"
          max="3"
          value=${props.fadeInTime}
          @change=${this._updateValue('fadeInTime')}
        /></s-slider>
        <span class="value">${Math.floor(props.fadeInTime)}s</span>
      </div>

      <div class="form-row">
        <label>Dry / Wet</label>
        <s-slider
          type="range"
          min="0"
          max="1"
          value=${props.dryWet}
          @change=${this._updateValue('dryWet')}
        /></s-expo-slider>
        <span class="value">${Math.floor(props.dryWet)}hz</span>
      </div>
    </form>`;
  }


  private _updateValue(prop: any) {
    return (e: any) => {
      // @ts-ignore
      this.input!.synthNode!.properties[prop] = e.target.value;
      this.requestUpdate();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.reverbSidebar]: ReverbSidebar;
  }
}
