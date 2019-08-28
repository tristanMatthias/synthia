import { customElement, html, LitElement, property } from 'lit-element';
import debounce = require('lodash.debounce');

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
  blur = 'blur',
  initialized = 'initialized'
}

@customElement(SElement.clipEditor)
export class ClipEditor extends LitElement {
  static get styles() {
    return [styles]
  }

  get clips(): ClipEditorClip[] {
    return Array.from(this.querySelectorAll(SElement.clipEditorClip));
  }

  clipElement = SElement.clipEditorClip;

  @property({reflect: true})
  rows: boolean = false;

  private _selectedClips: ClipEditorClip[] = [];
  private _mouseStartX: number | null = null;
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
    this.addEventListener('dblclick', this._handleDblClick.bind(this));
    this.addEventListener('mousedown', this._seek.bind(this));
    this.addEventListener('mouseup', this._handleMouseUp.bind(this));

    const updateTime = debounce(() => {
      // TODO: Time signature
      (this.shadowRoot!.querySelector('span.time')! as HTMLSpanElement).style.left = `calc(${Clock.currentBarExact} * var(--clip-width) * 4)`;
      this.requestUpdate();
      updateTime();
    }, 0, {
      maxWait: 500
    });
    requestAnimationFrame(updateTime)
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
      <slot></slot>
      <s-clock-line></s-clock-line>
    `;
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.initialized, {
      detail: this
    }));
  }


  private _handleDblClick(e: MouseEvent) {
    const { top, left } = this.getBoundingClientRect()

    const snapWidth = this._clipWidth;
    const snapHeight = this._clipHeight;

    const diffX = e.x - left;
    const diffY = e.y - top;

    const start = Math.floor(diffX / snapWidth);
    const row = this.rows ? Math.floor(diffY / snapHeight) : 0;

    console.log(start, row);


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
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.blur));
  }

  removeClips(e: ClipEditorClip[]) {
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.remove, {
      detail: e
    }))
  }

  clear() {
    this.innerHTML = '';
  }

  private _seek(e: MouseEvent) {
    const {left} = this.getBoundingClientRect();
    const clipWidth = this._clipWidth;
    const beat = Math.round((e.x - left) / clipWidth);
    Clock.seekBeat(beat);
    this.deselectAllClips();

    this.addEventListener('mousemove', this._handleMouseMove);
    this._mouseStartX = e.x;
    this._selectRange = null;
    this.requestUpdate();
  }

  private _handleMouseMove(e: MouseEvent) {
    const range = Math.round((e.x - this._mouseStartX!) / this._clipWidth);
    if (!this._selectRange) {
      this._selectRange = [Clock.currentBeat, Clock.currentBeat];
    }
    this._selectRange![1] = range + this._selectRange![0];
    this.requestUpdate();
  }

  private _handleMouseUp(_e: MouseEvent) {
    this.removeEventListener('mousemove', this._handleMouseMove);
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.clipEditor]: ClipEditor;
  }
}
