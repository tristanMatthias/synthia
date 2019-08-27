import { customElement, html, LitElement, property, query } from 'lit-element';

import { Position } from '../../../../lib/mixins/Draggable/Draggable';
import { remToPx } from '../../../../lib/pxToRem';
import { SElement } from '../../../../types';
import { ClipEditor } from '../ClipEditor';
import styles from './clip.styles';


export enum ClipEditorClipEvents {
  changeY = 'changeY'
}


@customElement(SElement.clipEditorClip)
export class ClipEditorClip extends LitElement {
  static styles = [styles]

  @property({ reflect: true, type: Boolean })
  selected = false;

  @property({ reflect: true })
  rows: boolean = false;


  protected _start: number;
  public get start() { return this._start; }
  public set start(v) {
    this._start = v;
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v) {
    this._duration = v;
  }


  @query('header')
  private _header: HTMLDivElement;

  private _mouseStart?: Position;
  private _dragType: 'drag' | 'resizeLeft' | 'resizeRight' | null = null;
  private _dragStartPosition: { start: number, duration: number } | null = null;
  protected get _editor(): ClipEditor {
    return this.parentElement as ClipEditor;
  }

  constructor() {
    super();
    this._handleDrag = this._handleDrag.bind(this);
    this._stopDrag = this._stopDrag.bind(this);
  }

  firstUpdated(props: Map<string, keyof ClipEditorClip>) {
    super.firstUpdated(props);
    // this._header.addEventListener('mousedown', (e) => {
    //   e.stopPropagation();
    // });

    this._header.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this._editor.removeClips([this]);
      this.remove();
    });
    this._header.addEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  render() {
    return html`<header></header>`;
  }

  private _handleMouseDown(e: MouseEvent) {
    e.stopPropagation();

    this._editor.selectClip(this, e.shiftKey);

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
    const clipWidth = remToPx(parseInt(style.getPropertyValue('--clip-width')));
    const clipHeight = remToPx(parseInt(style.getPropertyValue('--clip-height')));

    const xDiff = e.x - this._mouseStart!.x;
    const yDiff = e.y - this._editor.getBoundingClientRect().top;


    const gridDiffX = Math.round(xDiff / clipWidth);
    const gridDiffY = Math.round(yDiff / clipHeight) * clipHeight;

    let newStart = this._dragStartPosition!.start + gridDiffX;

    switch (this._dragType) {
      case 'resizeLeft':
        if (newStart < 0) {
          this.start = 0;
        } else {
          this.start = newStart;
          this.duration = this._dragStartPosition!.duration - gridDiffX;
        }
        break;

      case 'drag':
        if (newStart < 0) newStart = 0;
        this.start = newStart;

        if (this.rows) {
          this.style.top = `${gridDiffY}px`;
          this.dispatchEvent(new CustomEvent(ClipEditorClipEvents.changeY, {
            detail: gridDiffY
          }));
        }
        break;

      case 'resizeRight':
        this.duration = this._dragStartPosition!.duration + gridDiffX;
    }

    this._updatePosition();
  }


  private _updatePosition() {
    const style = getComputedStyle(this);
    const clipWidth = remToPx(parseInt(style.getPropertyValue('--clip-width')));

    this.style.left = `${(this.start) * clipWidth}px`;
    this.style.width = `${(this.duration) * clipWidth}px`;
  }


  private _stopDrag() {
    this._dragType = null;
    this._dragStartPosition = null;
    window.removeEventListener('mousemove', this._handleDrag);
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.clipEditorClip]: ClipEditorClip;
  }
}
