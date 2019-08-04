import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { frequencyToNote, keyToFrequency, noteToFrequency, realNotesCShifted } from '../../../lib/keyToFrequency';
import { SElement } from '../../../types';
import styles from './keyboard.styles';

export enum SynthiaKeyboardEvent {
  play = 'keyboard-play',
  stop = 'keyboard-stop',
}

@customElement(SElement.keyboard)
export class Keyboard extends LitElement {
  octave = 4;
  _pressed: Map<number, boolean> = new Map();
  _dragging = false;
  _draggingNote?: number;

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
    for (let i = 0; i < maxOctaves * 12; i ++ ) {
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
    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keyup', this._handleKeyUp);
    this.addEventListener('mousedown', this._handleMouseDown);
  }


  private _handleKeyPress(e: KeyboardEvent) {
    this._playFreq(keyToFrequency(e.key, this.octave))
  }

  private _handleKeyUp(e: KeyboardEvent) {
    this._stopFreq(keyToFrequency(e.key, this.octave))
  }

  private _handleMouseDown(e: MouseEvent) {
    this._dragging = true;
    window.addEventListener('mouseup', this._handleMouseUp)
  }

  private _handleMouseUp(e: MouseEvent) {
    this._dragging = false;
    if (this._draggingNote) this._stopFreq(this._draggingNote);
    window.removeEventListener('mouseup', this._handleMouseUp)
  }

  private _handleKeyMouseEnter(note: string, octave: number, click: boolean = false) {
    if (!this._dragging && !click) return;
    if (this._draggingNote) this._stopFreq(this._draggingNote);
    let o = octave;
    if (note === 'A' || note === 'A#') o -= 1;
    const f = noteToFrequency(note, o);
    this._playFreq(f);
    this._draggingNote = f;
  }
  private _handleKeyMouseOut(note: string, octave: number, click: boolean = false) {
    if (!this._dragging && !click) return;
    let o = octave;
    if (note === 'A' || note === 'A#') o -= 1;
    this._stopFreq(noteToFrequency(note, o));
  }

  private _playFreq(f: number | false) {
    if (f && !this._pressed.get(f)) {
      this._dispatch(SynthiaKeyboardEvent.play, f);
      this._pressed.set(f, true);
      this._toggleKey(f, true);
    }
  }

  private _stopFreq(f: number | false) {
    if (f) {
      this._dispatch(SynthiaKeyboardEvent.stop, f);
      this._pressed.delete(f);
      this._toggleKey(f, false);
    }
  }

  private _dispatch(event: SynthiaKeyboardEvent, freq: number) {
    this.dispatchEvent(new CustomEvent(event, {
      detail: freq
    }));
  }

  private _toggleKey(freq: number, state: boolean) {
    const { octave, note } = frequencyToNote(freq);
    const key = this.shadowRoot!.querySelector(`.${note.replace('#', 's').toLowerCase()}${octave}`);
    key!.classList.toggle('pressed', state)
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.keyboard]: Keyboard;
  }
}
