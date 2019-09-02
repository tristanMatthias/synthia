import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

import { noteToRow, realNotesCShifted } from '../../../lib/keyToFrequency';
import { MidiTrackClip } from '../../../lib/MidiTrack/MidiTrackClip';
import { SElement } from '../../../types';
import { ClipEditor } from '../ClipEditor/ClipEditor';
import styles from './piano-roll.styles';
import { PianoRollNote } from './PianoRollNote';
import { proxa, off } from 'proxa';

export * from './PianoRollNote';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  @property()
  midiTrackClip: MidiTrackClip | null = null;

  @query(SElement.clipEditor)
  editor: ClipEditor;

  private get mc() {
    if (!this.midiTrackClip) return null;
    return this.midiTrackClip.midiClip;
  }


  constructor() {
    super();
    this._update = this._update.bind(this);
  }


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

    if (!this.midiTrackClip) return html``;

    return html`
      <div class="keys">
        ${keys}
      </div>
      <s-clip-editor
        rows=${true}
        start=${this.midiTrackClip.midiTrackClip.start}
        duration=${this.midiTrackClip.midiTrackClip.duration}
        .clipElement=${SElement.pianoRollNote}
        @initialized=${this._setupEditor}
        @add=${(e: any) => this.mc!.addNote(e.detail.midiNote)}
        @remove=${(e: any) => this.removeNotes(e.detail)}
      ></s-clip-editor>
    `;
  }


  // Plot the notes
  private _setupEditor() {
    if (!this.mc) return false;

    proxa(this.midiTrackClip!.midiTrackClip, this._update);


    const editor = this.editor;

    this.mc.notes.forEach(n => {
      const row = noteToRow(n.n);
      const clip = editor.createClip(n.s, row, n.d, true) as PianoRollNote;
      clip.midiNote = n;
      editor.appendChild(clip);
    });

    return true;
  }

  // Cleanup proxa watching
  update(props: Map<keyof this, any>) {
    super.update(props);
    if (props.has('midiTrackClip') && this.editor.initialized) {
      this._dispose(props.get('midiTrackClip'));
    }
  }

  updated(props: Map<keyof this, any>) {
    super.updated(props);
    if (props.has('midiTrackClip') && this.editor.initialized) {
      this.editor.clear();
      this._setupEditor();
    }
  }


  removeNotes(notes: PianoRollNote[]) {
    if (!this.mc) return false;

    notes.forEach(n => {
      const i = this.mc!.notes.indexOf(n.midiNote);
      this.mc!.notes.splice(i, 1);
    });

    return true;
  }

  disconnectedCallback() {
    this._dispose();
    super.disconnectedCallback();
  }

  private _update() {
    this.requestUpdate();
  }

  private _dispose(mtc = this.midiTrackClip) {
    if (!mtc) return;
    off(mtc.midiTrackClip, this._update);
  }
}
