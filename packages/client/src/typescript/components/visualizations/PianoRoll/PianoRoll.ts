import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { realNotesCShifted } from '../../../lib/Instruments/keyToFrequency';
import { SElement } from '../../../types';
import styles from './piano-roll.styles';
import { remToPx } from '../../../lib/pxToRem';
import { Clock } from '../../../lib/Clock';
import debounce = require('lodash.debounce');
import { MidiNote } from '../../../lib/MidiTrack/MIDINote';
import { PianoRollNote } from './Note';

export * from './Note';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  notes: MidiNote[];

  private _selectedNotes: PianoRollNote[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', this._addNote.bind(this));
    this.addEventListener('mousedown', this._seek.bind(this));

    const updateTime = debounce(() => {
      (this.shadowRoot!.querySelector('span.time')! as HTMLSpanElement).style.left = `calc(${Clock.currentBarExact} * var(--note-width) * 4)`;
      this.requestUpdate();
      updateTime();
    }, 0, {
      maxWait: 500
    });
    requestAnimationFrame(updateTime)
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

    return html`
      ${keys}
      <slot></slot>
      <s-clock-line></s-clock-line>
    `;
  }


  private _addNote(e: MouseEvent) {
    const { top, left } = this.getBoundingClientRect()

    const styles = getComputedStyle(this);
    const snapWidth = remToPx(parseInt(styles.getPropertyValue('--note-width')));
    const snapHeight = remToPx(parseInt(styles.getPropertyValue('--note-height')));

    const diffX = e.x - left - remToPx(8);
    const diffY = e.y - top;

    const snapX = Math.floor(diffX / snapWidth) * snapWidth;
    const snapY = Math.floor(diffY / snapHeight) * snapHeight;

    const note = document.createElement(SElement.pianoRollNote);
    note.start = snapX / snapWidth;
    note.duration = 1;
    const n = this.getNoteFromY(snapY);
    note.note = n.note + n.octave;
    note.style.left = `${snapX + remToPx(8)}px`;
    note.style.top = `${snapY}px`;

    this.getNoteFromY(snapY);
    this.notes.push(note.midiNote);

    this.appendChild(note);
  }


  getNoteFromY(y: number) {
    const styles = getComputedStyle(this);
    const noteHeight = remToPx(parseInt(styles.getPropertyValue('--note-height')));
    const row = Math.floor(y / noteHeight);

    let shifted = row - 1;
    if (shifted == -1) shifted = 11;

    return {
      note: realNotesCShifted.slice().reverse()[shifted % 12],
      octave: 6 - Math.floor((row - 4) / 12)
    };
  }


  selectNote(n: PianoRollNote, multiple = false) {
    if (!multiple) {
      this._selectedNotes.forEach(n => n.selected = false);
      this._selectedNotes = [n];
      n.selected = true;
    } else {
      const index = this._selectedNotes.indexOf(n);
      if (index >= 0) {
        n.selected = false;
        this._selectedNotes.splice(index, 1);
      } else {
        this._selectedNotes.push(n);
        n.selected = true;
      }
    }
  }

  deselectAllNotes() {
    this._selectedNotes.forEach(n => n.selected = false);
    this._selectedNotes = [];
  }

  _seek(e: MouseEvent) {
    const styles = getComputedStyle(this);
    const keyWidth = remToPx(parseInt(styles.getPropertyValue('--key-width')));
    const noteWidth = remToPx(parseInt(styles.getPropertyValue('--note-width')));
    Clock.seekBeat((e.x - keyWidth) / noteWidth);
    this.deselectAllNotes();
  }
}
