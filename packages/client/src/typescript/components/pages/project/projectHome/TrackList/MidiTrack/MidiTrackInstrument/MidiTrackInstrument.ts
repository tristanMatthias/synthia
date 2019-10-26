import { customElement, html, LitElement } from 'lit-element';
import { proxa } from 'proxa';

import styles from './track-instrument.styles';
import { MidiTrack } from '../../../../../../../lib/MidiTrack/MIDITrack';
import { project } from '../../../../../../../lib/Project/Project';
import { SElement } from '../../../../../../../types';


@customElement(SElement.midiTrackInstrument)
export class MidiTrackInstrument extends LitElement {
  static styles = [styles];


  private _track: MidiTrack;
  public get track() {
    return this._track;
  }
  public set track(v) {
    this._track = proxa(v, () => {
      this.requestUpdate()
    });
    this.requestUpdate();
  }

  get instrument() {
    return this.track.instrument ? this.track.instrument.instrumentObject : null;
  }


  render() {
    const instrument = this.instrument
      ? html`<div class="item">
        <header>
          <a href="/project/${project.file!.id}/synth/${this.instrument.id}">
            ${this.instrument.name}
          </a>
        </header>
      </div>`
      : html`<div class="empty">No instrument loaded</div>`;

    return html`
      ${instrument}
    `;
  }
}
