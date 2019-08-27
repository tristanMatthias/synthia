import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { customElement } from 'lit-element';

import { SElement } from '../../../types';
import { ClipEditorClip, ClipEditorClipEvents } from '../ClipEditor/Clip/Clip';
import { remToPx } from '../../../lib/pxToRem';
import { realNotesCShifted, stringToNoteAndOctave } from '../../../lib/Instruments/keyToFrequency';

@customElement(SElement.pianoRollNote)
export class PianoRollNote extends ClipEditorClip {

  midiNote: EMidiClipNote = { s: 0, d: 0, n: 'A4', v: 1 };

  protected _start: number;
  public get start() { return this._start; }
  public set start(v: number) {
    this._start = v;
    console.log('setting s', v);

    this.midiNote.s = v;
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v: number) {
    this._duration = v;
    this.midiNote.d = v;
  }

  protected _note: string;
  public get note() { return this._note; }
  public set note(v) {
    this._note = v;
    const [note, octave] = stringToNoteAndOctave(v)!;
    this.midiNote.n = `${note}${octave}`;
  }


  constructor() {
    super();
    this.addEventListener(ClipEditorClipEvents.changeY, (e: EventModifierInit) => this._updatePitch(e.detail))
  }

  connectedCallback() {
    super.connectedCallback();
    this._updatePitch();
  }

  private _updatePitch(y: number = parseInt(this.style.top!)) {
    const styles = getComputedStyle(this._editor);
    const noteHeight = remToPx(parseInt(styles.getPropertyValue('--clip-height')));
    const row = Math.floor(y / noteHeight);

    let shifted = row - 1;
    if (shifted == -1) shifted = 11;


    const note = realNotesCShifted.slice().reverse()[shifted % 12];
    const octave = 6 - Math.floor((row - 4) / 12);
    this.midiNote.n = `${note}${octave}`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.pianoRollNote]: PianoRollNote;
  }
}
