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
  select = 'select'
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

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', this._addClip.bind(this));
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


  private _addClip(e: MouseEvent) {
    const { top, left } = this.getBoundingClientRect()

    const styles = getComputedStyle(this);
    const snapWidth = this._clipWidth;
    const snapHeight = remToPx(parseInt(styles.getPropertyValue('--clip-height')));

    const diffX = e.x - left;
    const diffY = e.y - top;

    const snapX = Math.floor(diffX / snapWidth) * snapWidth;
    const snapY = this.rows ? Math.floor(diffY / snapHeight) * snapHeight : 0;

    const clip = document.createElement(this.clipElement) as ClipEditorClip;
    clip.rows = this.rows;

    clip.start = snapX / snapWidth;
    clip.duration = 1;
    clip.style.left = `${snapX}px`;
    clip.style.top = `${snapY}px`;
    this.appendChild(clip);

    this.dispatchEvent(new CustomEvent('add', {
      detail: clip
    }))
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
  }

  removeClips(e: ClipEditorClip[]) {
    this.dispatchEvent(new CustomEvent(ClipEditorEvents.remove, {
      detail: e
    }))
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
    console.log(this._selectRange);

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
