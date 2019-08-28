import { EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { customElement, html, query, property } from 'lit-element';

import { MidiClip } from '../../../../../../../lib/MidiTrack/MidiClip';
import { MidiTrack } from '../../../../../../../lib/MidiTrack/MIDITrack';
import { ClipEditorClip } from '../../../../../../visualizations/ClipEditor/Clip/Clip';
import styles from './track-clip.styles';
import { proxa } from 'proxa';
import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { noteToRow } from '../../../../../../../lib/keyToFrequency';
import { remToPx } from '../../../../../../../lib/pxToRem';

@customElement('s-track-clip')
export class TrackClip extends ClipEditorClip {
  static styles = [
    ...ClipEditorClip.styles,
    styles
  ];

  midiTrack: MidiTrack;
  @property()
  midiClip: MidiClip;
  trackClipObject: EMidiTrackClip;

  protected _start: number;
  public get start() { return this._start; }
  public set start(v: number) {
    this._start = v;
    if (this.trackClipObject) this.trackClipObject.start = v;
    this._updatePosition();
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v: number) {
    this._duration = v;
    if (this.trackClipObject) this.trackClipObject.duration = v;
    this._updatePosition();
    if (this.isConnected) this.draw();
  }

  @query('canvas')
  private _canvas: HTMLCanvasElement;

  private _noteRows: Map<EMidiClipNote, number> = new Map();

  private get _clipWidth() {
    const styles = getComputedStyle(this);
    return remToPx(parseInt(styles.getPropertyValue('--clip-width')));
  }

  private get _colorNote() {
    return getComputedStyle(this).getPropertyValue('--color-note');
  }


  updated(props: Map<keyof this, any>) {
    super.updated(props);
    this._updateMap();
    this.draw();

    if (props.has('midiClip')) {
      proxa(this.midiClip.notes, () => {
        this._updateMap();
        this.draw()
      });
    }
  }

  render() {
    return html`
      <header>${this.midiClip.midiClipObject.name}</header>
      <canvas></canvas>
    `;
  }

  private _updateMap() {
    this._noteRows.clear();
    this.midiClip.notes.forEach(n => {
      this._noteRows.set(n, noteToRow(n.n));
    });
  }

  private draw() {
    const c = this._canvas;
    const {width, height} = getComputedStyle(c);
    const w = c.width = parseInt(width!);
    const h = c.height = parseInt(height!);

    const ctx = c.getContext('2d')!;

    const notes = Array.from(this._noteRows.entries());
    const rows =notes.map(([, row]) => row);
    if (!rows.length) return;

    let min: number;
    let max: number;
    if (rows.length === 1) {
      min = 1;
      max = 1;
    } else {
      min = Math.min(...rows);
      max = Math.max(...rows);
    }
    const clipW = this._clipWidth;

    const rowNum = max - min;
    let rowHeight = h / (rowNum + 1);
    if (rowHeight > 20) rowHeight = 20;
    if (rowHeight < 2) rowHeight = 2;

    const sum = rowHeight * (rowNum + 1);
    const margin = (sum < h) ? (h - sum) / 2 : 0;



    ctx.fillStyle = this._colorNote;
    ctx.clearRect(0, 0, w, h);

    notes.forEach(([n, r]) => {
      ctx.strokeStyle = '';
      const normalized = (r - min) / (rowNum + 1);
      ctx.fillRect(n.s * clipW, (normalized * (h - margin * 2)) + margin, n.d * clipW - 1, rowHeight - 1);
    });

  }
}
