import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

import { noteToRow, realNotesCShifted } from '../../../lib/keyToFrequency';
import { MidiClip } from '../../../lib/MidiTrack/MidiClip';
import { SElement } from '../../../types';
import { ClipEditor } from '../ClipEditor/ClipEditor';
import styles from './piano-roll.styles';
import { PianoRollNote } from './PianoRollNote';

export * from './PianoRollNote';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  @property()
  midiClip: MidiClip;

  @property()
  start: number;

  @property()
  duration: number;

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
        start=${this.start}
        duration=${this.duration}
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

    this.midiClip.notes.forEach(n => {
      const row = noteToRow(n.n);
      const clip = editor.createClip(n.s, row, n.d, true) as PianoRollNote;

      clip.midiNote = n;
      editor.appendChild(clip);
    })
  }

  updated(props: Map<keyof this, any>) {
    super.updated(props);
    if (props.has('midiClip') && this.editor.initialized) {
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
