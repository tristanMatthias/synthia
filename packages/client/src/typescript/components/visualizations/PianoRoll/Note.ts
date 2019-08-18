import { LitElement, css, customElement, html } from "lit-element";
import { SElement } from "../../../types";
import { Position } from "../../../lib/mixins/Draggable/Draggable";
import { remToPx } from "../../../lib/pxToRem";

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
    `]
  }

  start: number;
  duration: number;

  private _mouseStart?: Position;
  private _dragType: 'drag' | 'resizeLeft' | 'resizeRight' | null = null;
  private _dragStartPosition: {start: number, duration: number} | null = null;

  constructor() {
    super();
    this._handleDrag = this._handleDrag.bind(this);
    this._stopDrag = this._stopDrag.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
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
    this._dragStartPosition = {start: this.start, duration: this.duration};

    let handle = 5;


    if (x < handle) this._dragType = 'resizeLeft';
    else if (x >= width - handle) this._dragType = 'resizeRight';
    else this._dragType = 'drag';

    window.addEventListener('mousemove', this._handleDrag);
    window.addEventListener('mouseup', this._stopDrag);
  }


  private _handleDrag(e: MouseEvent) {
    const style = getComputedStyle(this);
    const noteWidth = remToPx(parseInt(style.getPropertyValue('--note-width')));

    const xDiff = e.x - this._mouseStart!.x;

    const gridDiff = Math.round(xDiff / noteWidth);

    switch (this._dragType) {
      case 'resizeLeft':
        this.start = this._dragStartPosition!.start + gridDiff;
        this.duration = this._dragStartPosition!.duration - gridDiff;
        break;

      case 'drag':
        this.start = this._dragStartPosition!.start + gridDiff;
        break;

      case 'resizeRight':
        this.duration = this._dragStartPosition!.duration + gridDiff;
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
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.pianoRollNote]: PianoRollNote;
  }
}
