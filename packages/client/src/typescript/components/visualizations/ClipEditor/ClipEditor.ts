import { customElement, html, LitElement, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { activeElement } from '../../../lib/activeElement';
import { Clock } from '../../../lib/Clock';
import { remToPx } from '../../../lib/pxToRem';
import { SElement } from '../../../types';
import styles from './clip-editor.styles';
import { ClipEditorClip } from './Clip/Clip';

export * from './Clip/Clip';

export enum ClipEditorEvents {
  add = 'add',
  remove = 'remove',
  select = 'select',
  deselect = 'deselect',
  initialized = 'initialized'
}

@customElement(SElement.clipEditor)
export class ClipEditor extends LitElement {
  static get styles() {
    return [styles]
  }

  tabIndex = 0;

  get clips(): ClipEditorClip[] {
    return Array.from(this.childNodes) as ClipEditorClip[];
  }

  clipElement = SElement.clipEditorClip;

  @property({ reflect: true })
  rows: boolean = false;

  @property({ reflect: true, type: Number })
  start: number = 0;

  @property({ reflect: true, type: Number })
  duration: number;

  @property({ type: String })
  emptyText: string = 'Double click to add a clip';

  @property({ reflect: true })
  dblClick: boolean = true;

  initialized = false;

  private _selectedClips: ClipEditorClip[] = [];
  private _mouseStart: [number, number] | null = null;
  private _selectRange: [number, number] | null = null;
  private get _clipWidth() {
    const styles = getComputedStyle(this);
    return remToPx(parseInt(styles.getPropertyValue('--clip-width')));
  }
  private get _clipHeight() {
    const styles = getComputedStyle(this);
    return remToPx(parseInt(styles.getPropertyValue('--clip-height')));
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.dblClick) this.addEventListener('dblclick', this._handleDblClick.bind(this));
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.addEventListener('mouseup', this._handleMouseUp.bind(this));
    this.addEventListener('keydown', this._handleKeyPress.bind(this));
  }

  render() {
    let range = null;
    if (this._selectRange) {
      const min = Math.min(...this._selectRange);
      const max = Math.max(...this._selectRange);
      const width = max - min;
      if (width) {
        range = html`<span class="range" style="left: calc(${min} * var(--clip-width)); width: calc(${width} * var(--clip-width))"></span>`;
      }
    }

    return html`
      ${range}
      ${this.duration
        ? html`<div class="duration" style="left: calc(${this.duration} * var(--clip-width))"></div>`
        : null
      }
      <slot></slot>
      <s-clock-line
        offset=${ifDefined(this.start)}
        duration=${ifDefined(this.duration)}
      ></s-clock-line>
      ${!this.clips.length
        ? html`<span class="empty">${this.emptyText}</span>`
        : null
      }
    `;
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.initialized, {
      detail: this
    }));
    this.initialized = true;
  }

  appendChild<T extends Node>(newChild: T) {
    super.appendChild(newChild);
    this.requestUpdate();
    return newChild;
  }


  private _handleDblClick(e: MouseEvent) {
    const { top, left } = this.getBoundingClientRect()

    const snapWidth = this._clipWidth;
    const snapHeight = this._clipHeight;

    const diffX = e.x - left;
    const diffY = e.y - top;

    const start = Math.floor(diffX / snapWidth);
    const row = this.rows ? Math.floor(diffY / snapHeight) : 0;

    const clip = this.createClip(start, row);

    this.dispatchEvent(new CustomEvent('add', {
      detail: clip
    }))
  }

  createClip(
    start: number,
    row: number = 0,
    duration: number = 1,
    defer = false
  ) {
    const clip = document.createElement(this.clipElement) as ClipEditorClip;
    clip.rows = this.rows;
    clip.start = start;
    clip.duration = duration;
    clip.style.left = `${start * this._clipWidth}px`;
    clip.style.width = `${duration * this._clipWidth}px`;
    clip.style.top = `${row * this._clipHeight}px`;
    if (!defer) this.appendChild(clip);
    return clip;
  }


  selectClip(n: ClipEditorClip, multiple = false) {
    if (!multiple) {
      this._selectedClips.forEach(n => n.selected = false);
      this._selectedClips = [n];
      n.selected = true;
    } else {
      const index = this._selectedClips.indexOf(n);
      if (index >= 0) {
        n.selected = false;
        this._selectedClips.splice(index, 1);
      } else {
        this._selectedClips.push(n);
        n.selected = true;
      }
    }

    this.dispatchEvent(new CustomEvent(ClipEditorEvents.select, {
      detail: this._selectedClips
    }));
  }

  deselectAllClips() {
    this._selectedClips.forEach(n => n.selected = false);
    this._selectedClips = [];
    if (activeElement() === this) {
      this.dispatchEvent(new CustomEvent(ClipEditorEvents.deselect));
    }

  }

  removeClips(e: ClipEditorClip[]) {
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.remove, {
      detail: e
    }))
  }

  clear() {
    this.innerHTML = '';
  }

  private _seek(
    beat?: number,
    increment?: number,
    bar = false
  ) {
    let b = beat;
    if (increment) {
      b = Clock.currentBeat + increment;

      // TODO: Time signature
      if (bar) {
        if ((b + 1) % 4 === 0 || increment > 0) b = (Clock.currentBar + increment) * 4;
        else b = Clock.currentBar * 4;
      }
    }
    if (b === undefined) return;

    Clock.seekBeat(b);
    this.deselectAllClips();
    this._selectRange = null;
    this._resetRange();
  }


  private _handleMouseDown(e: MouseEvent) {
    const { left } = this.getBoundingClientRect();
    const clipWidth = this._clipWidth;
    const beat = Math.round((e.x - left) / clipWidth) + this.start;

    this._mouseStart = [e.x, beat - this.start];
    this.addEventListener('mousemove', this._handleMouseMove);

    if (e.shiftKey) {
      this._updateRange(beat);
    } else {
      this._seek(beat);
    }
  }

  private _handleMouseMove(e: MouseEvent) {
    if (!e.shiftKey) return;
    this._updateRange(
      // The initial beat position where clicked
      this._mouseStart![1] +
      // The difference in beats
      Math.round((e.x - this._mouseStart![0]!) / this._clipWidth)
    );
  }

  private _handleMouseUp(_e: MouseEvent) {
    this.removeEventListener('mousemove', this._handleMouseMove);
  }


  private _handleKeyPress(e: KeyboardEvent) {
    switch (e.code) {
      case 'ArrowLeft':
        if (e.shiftKey) {
          this._updateRange(-1, false);
        } else this._seek(undefined, - 1, e.altKey);
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          this._updateRange(1, false);
        } else this._seek(undefined, + 1, e.altKey);
        break;
    }
  }


  private _resetRange() {
    const b = Clock.currentBeat - this.start;
    this._selectRange = [b, b];
    this.requestUpdate();
  }


  private _updateRange(size: number, absolute = true) {
    let isNew = false;
    if (!this._selectRange) {
      this._resetRange();
      isNew = true;
    }
    // Update the range
    if (absolute) this._selectRange![1] = size;
    else this._selectRange![1] += size;

    if (this._selectRange![0] === this._selectRange![1] && !isNew) {
      this._selectRange = null;
    }

    this.requestUpdate();
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.clipEditor]: ClipEditor;
  }
}
