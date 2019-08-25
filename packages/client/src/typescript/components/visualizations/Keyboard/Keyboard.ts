import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { keyToNote, realNotesCShifted, stringToNoteAndOctave } from '../../../lib/Instruments/keyToFrequency';
import { SElement } from '../../../types';
import { PageSynth } from '../../pages/project/synth/synth.page';
import styles from './keyboard.styles';

export enum SynthiaKeyboardEvent {
  play = 'keyboard-play',
  stop = 'keyboard-stop',
}

@customElement(SElement.keyboard)
export class Keyboard extends LitElement {
  octave = 4;
  _pressed: Map<string, boolean> = new Map();
  _dragging = false;
  _draggingNote?: string;

  private _synth: PageSynth;

  static get styles() {
    return [styles]
  }

  constructor(
  ) {
    super();
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    this._handleKeyMouseEnter = this._handleKeyMouseEnter.bind(this);
    this._handleKeyMouseOut = this._handleKeyMouseOut.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
  }

  render() {
    const maxOctaves = 7;
    const keys: TemplateResult[] = [];

    let octave = 1;
    for (let i = 0; i < maxOctaves * 12; i++) {
      const n = realNotesCShifted[i % 12];
      if (n === 'A') octave += 1;
      let o = octave;

      let className = n.length == 2 ? 'black' : 'white';
      className += ` ${n.replace('#', 's').toLowerCase()}${o}`;
      keys.push(html`<div
          class=${className}
          @mouseenter=${() => this._handleKeyMouseEnter(n, o)}
          @mouseout=${() => this._handleKeyMouseOut(n, o)}
          @mousedown=${() => this._handleKeyMouseEnter(n, o, true)}
          @mouseup=${() => this._handleKeyMouseOut(n, o, true)}
        ></div>`);
    };

    return html`${keys}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this._synth = document.querySelector(SElement.synthPage)!;
    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keyup', this._handleKeyUp);
    this.addEventListener('mousedown', this._handleMouseDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keypress', this._handleKeyPress);
    window.removeEventListener('keyup', this._handleKeyUp);
  }


  private _handleKeyPress(e: KeyboardEvent) {
    const n = keyToNote(e.key, this.octave);
    if (n) this._play(n.note + n.octave);
  }

  private _handleKeyUp(e: KeyboardEvent) {
    const n = keyToNote(e.key, this.octave);
    if (n) this._stop(n.note + n.octave);
  }

  private _handleMouseDown() {
    this._dragging = true;
    window.addEventListener('mouseup', this._handleMouseUp)
  }

  private _handleMouseUp() {
    this._dragging = false;
    if (this._draggingNote) this._play(this._draggingNote);
    window.removeEventListener('mouseup', this._handleMouseUp)
  }

  private _handleKeyMouseEnter(note: string, octave: number, click: boolean = false) {
    if (!this._dragging && !click) return;
    let o = octave;
    if (this._draggingNote) this._stop(this._draggingNote);
    this._play(note + o);
    this._draggingNote = note + o;
  }
  private _handleKeyMouseOut(note: string, octave: number, click: boolean = false) {
    if (!this._dragging && !click) return;
    let o = octave;
    this._stop(note + o);
  }

  private _play(n: string) {
    if (n && !this._pressed.get(n)) {
      this._pressed.set(n, true);
      this._synth.synth.triggerAttack([n]);
      let [note, octave] = stringToNoteAndOctave(n)!;
      if (note == 'A' || note == 'A#') octave += 1;
      this._toggleKey(note, octave, true);
    }
  }
  private _stop(n: string) {
    this._pressed.delete(n);
    this._synth.synth.triggerRelease([n]);
    let [note, octave] = stringToNoteAndOctave(n)!;
    if (note == 'A' || note == 'A#') octave += 1;
    this._toggleKey(note, octave, false);
  }

  private _toggleKey(note: string, octave: number, state: boolean) {
    const key = this.shadowRoot!.querySelector(`.${note.replace('#', 's').toLowerCase()}${octave}`);
    key!.classList.toggle('pressed', state)
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.keyboard]: Keyboard;
  }
}
