import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { realNotesCShifted } from '../../../lib/Instruments/keyToFrequency';
import { SElement } from '../../../types';
import styles from './piano-roll.styles';
import { remToPx } from '../../../lib/pxToRem';
import { Clock } from '../../../lib/Clock';
import debounce = require('lodash.debounce');
import { MidiNote } from '../../../lib/MidiTrack/MIDINote';

export * from './Note';

@customElement(SElement.pianoRoll)
export class PianoRoll extends LitElement {
  static get styles() {
    return [styles]
  }

  notes: MidiNote[];

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', this._addNote.bind(this));
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

    let octave = 1;
    for (let i = 0; i < maxOctaves * 12; i++) {
      const n = realNotesCShifted[i % 12];
      if (n === 'A') octave += 1;
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
      <synthia-clock-line></synthia-clock-line>
    `;
  }


  private _addNote(e: MouseEvent)  {
    const {top, left} = this.getBoundingClientRect()

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
    note.style.left = `${snapX + remToPx(8)}px`;
    note.style.top = `${snapY}px`;


    this.notes.push(note.midiNote);

    this.appendChild(note);
  }

}
