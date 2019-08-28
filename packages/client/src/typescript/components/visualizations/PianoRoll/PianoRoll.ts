import { customElement, html, LitElement, TemplateResult, property, query } from 'lit-element';

import { realNotesCShifted, stringToNoteAndOctave, realNotes } from '../../../lib/keyToFrequency';
import { MidiClip } from '../../../lib/MidiTrack/MidiClip';
import { SElement } from '../../../types';
import { PianoRollNote } from './PianoRollNote';
import styles from './piano-roll.styles';
import { ClipEditor } from '../ClipEditor/ClipEditor';

export * from './PianoRollNote';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  @property()
  midiClip: MidiClip;

  @query(SElement.clipEditor)
  editor: ClipEditor;


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
        @initialized=${this._setupEditor}
        @add=${(e: any) => this.midiClip.notes.push(e.detail.midiNote)}
        @remove=${(e: any) => this.removeNotes(e.detail)}
      ></s-clip-editor>
    `;
  }


  // Plot the notes
  private _setupEditor() {
    const editor = this.editor;
    const revC = realNotesCShifted.slice().reverse();
    revC.unshift(revC.pop()!)
    const rev = realNotes.slice().reverse();

    this.midiClip.notes.forEach(n => {
      const [note, octave] = stringToNoteAndOctave(n.n)!;
      let row = revC.indexOf(note);

      if (octave < 7) {
        row = rev.indexOf(note) + (12 * (6 - octave)) + 4;
      }

      const clip = editor.createClip(n.s, row, n.d, true) as PianoRollNote;

      clip.midiNote = n;
      editor.appendChild(clip);
    })
  }

  updated(props: Map<keyof this, any>) {
    super.updated(props);
    if (props.has('midiClip')) {
      this.editor.clear();
      this._setupEditor();
    }
  }


  removeNotes(notes: PianoRollNote[]) {
    notes.forEach(n => {
      const i = this.midiClip.notes.indexOf(n.midiNote);
      this.midiClip.notes.splice(i, 1);
    });
  }
}
