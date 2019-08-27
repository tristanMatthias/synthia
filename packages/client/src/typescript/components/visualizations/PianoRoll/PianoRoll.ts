import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { realNotesCShifted } from '../../../lib/Instruments/keyToFrequency';
import { SElement } from '../../../types';
import styles from './piano-roll.styles';
import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { proxa } from 'proxa';
import { PianoRollNote } from './Note';

export * from './Note';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  notes: EMidiClipNote[] = proxa([]);


  render() {
    const maxOctaves = 7;
    const keys: TemplateResult[] = [];

    let octave = maxOctaves;
    for (let i = maxOctaves * 12; i > 0; i--) {
      const n = realNotesCShifted[i % 12];
      if (n === 'G#') octave -= 1;
      let o = octave;

      let className = n.length == 2 ? 'black' : 'white';
      className += ` ${n.replace('#', 's').toLowerCase()}${o}`;
      keys.push(html`<div class=${className}>
        <span>${n}${o}</span>
      </div>`);
    };

    return html`
      <div class="keys">
        ${keys}
      </div>
      <s-clip-editor
        rows=${true}
        .clipElement=${SElement.pianoRollNote}
        @add=${(e: any) => this.notes.push(e.detail.midiNote)}
        @remove=${(e: any) => this.removeNotes(e.detail)}
      ></s-clip-editor>
    `;
  }



  removeNotes(notes: PianoRollNote[]) {
    notes.forEach(n => {
      const i = this.notes.indexOf(n.midiNote);
      this.notes.splice(i, 1);
    });
  }
}
