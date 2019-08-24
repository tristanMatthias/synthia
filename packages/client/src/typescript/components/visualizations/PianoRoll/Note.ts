import { LitElement, css, customElement, html, property } from "lit-element";
import { SElement } from "../../../types";
import { Position } from "../../../lib/mixins/Draggable/Draggable";
import { remToPx } from "../../../lib/pxToRem";
import { MidiNote } from "../../../lib/MidiTrack/MIDINote";
import { stringToNoteAndOctave } from "../../../lib/Instruments/keyToFrequency";
import { PianoRoll } from "./PianoRoll";

@customElement(SElement.pianoRollNote)
export class PianoRollNote extends LitElement {

  static get styles() {
    return [css`
      :host {
        position: absolute;
        height: var(--note-height);
        width: var(--note-width);
        background: var(--color-alt);
        border-left: 0.1rem solid var(--color-bg);
        border: 0.1rem solid var(--color-bg);
        box-sizing: border-box;
        cursor: move;
      }
      :host:before, :host:after {
        content: '';
        position: absolute;
        width: 0.5rem;
        height: 100%;
        background: red;
        cursor: col-resize;
        background: var(--color-bg);
        opacity: 0.3;
      }
      :host:after {
        right: 0;
      }
      :host([selected]) {
        background: var(--color-accent);
      }
    `]
  }

  midiNote: MidiNote;


  @property({reflect: true, type: Boolean})
  selected = false;


  private _start : number;
  public get start() { return this._start; }
  public set start(v) {
    this._start = v;
    this.midiNote.start = v;
  }

  private _duration : number;
  public get duration() { return this._duration; }
  public set duration(v) {
    this._duration = v;
    this.midiNote.duration = v;
  }

  private _note : string;
  public get note() { return this._note; }
  public set note(v) {
    this._note = v;
    const [note, octave] = stringToNoteAndOctave(v)!;
    this.midiNote.note = note;
    this.midiNote.octave = octave;
  }


  private _mouseStart?: Position;
  private _dragType: 'drag' | 'resizeLeft' | 'resizeRight' | null = null;
  private _dragStartPosition: { start: number, duration: number } | null = null;
  private get _pr(): PianoRoll {
    return this.parentElement as PianoRoll;
  }

  constructor() {
    super();
    this.midiNote = new MidiNote(0, 0);
    this._handleDrag = this._handleDrag.bind(this);
    this._stopDrag = this._stopDrag.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this._pr.selectNote(this, e.shiftKey);
    });

    this.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.remove();
    });
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  render() {
    return html`<span></span>`;
  }

  private _handleMouseDown(e: MouseEvent) {
    const { left, width } = this.getBoundingClientRect();
    const x = e.x - left;
    this._mouseStart = { x: e.x, y: e.y };
    this._dragStartPosition = { start: this.start, duration: this.duration };

    let handle = 5;


    if (x < handle) this._dragType = 'resizeLeft';
    else if (x >= width - handle) this._dragType = 'resizeRight';
    else this._dragType = 'drag';

    window.addEventListener('mousemove', this._handleDrag);
    window.addEventListener('mouseup', this._stopDrag);
  }


  private _handleDrag(e: MouseEvent) {
    e.stopPropagation();
    const style = getComputedStyle(this);
    const noteWidth = remToPx(parseInt(style.getPropertyValue('--note-width')));
    const noteHeight = remToPx(parseInt(style.getPropertyValue('--note-height')));

    const xDiff = e.x - this._mouseStart!.x;
    const yDiff = e.y - this.closest(SElement.pianoRoll)!.getBoundingClientRect().top;

    const gridDiffX = Math.round(xDiff / noteWidth);
    const gridDiffY = Math.round(yDiff / noteHeight) * noteHeight;


    switch (this._dragType) {
      case 'resizeLeft':
        this.start = this._dragStartPosition!.start + gridDiffX;
        this.duration = this._dragStartPosition!.duration - gridDiffX;
        break;

      case 'drag':
        this.start = this._dragStartPosition!.start + gridDiffX;
        this.style.top = `${gridDiffY}px`;
        this._updatePitch(gridDiffY);
        break;

      case 'resizeRight':
        this.duration = this._dragStartPosition!.duration + gridDiffX;
    }

    this._updatePosition();
  }


  private _updatePosition() {
    const style = getComputedStyle(this);
    const noteWidth = remToPx(parseInt(style.getPropertyValue('--note-width')));

    this.style.left = `calc(${(this.start) * noteWidth}px + var(--key-width))`;
    this.style.width = `${(this.duration) * noteWidth}px`;
  }


  private _stopDrag() {
    this._dragType = null;
    this._dragStartPosition = null;
    window.removeEventListener('mousemove', this._handleDrag);
  }

  private _updatePitch(y: number = parseInt(this.style.top!)) {
    const n = this._pr.getNoteFromY(y);
    this.midiNote.note = n.note;
    this.midiNote.octave = n.octave;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.pianoRollNote]: PianoRollNote;
  }
}
