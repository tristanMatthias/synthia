import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { customElement, html, property, query } from 'lit-element';
import { proxa } from 'proxa';

import { Clock } from '../../../../../../../lib/Clock';
import { noteToRow } from '../../../../../../../lib/keyToFrequency';
import { MidiTrackClip } from '../../../../../../../lib/MidiTrack/MidiTrackClip';
import { remToPx } from '../../../../../../../lib/pxToRem';
import { Recorder } from '../../../../../../../lib/Recorder';
import { ClipEditorClip } from '../../../../../../visualizations/ClipEditor/Clip/Clip';
import styles from './track-clip.styles';

@customElement('s-track-clip')
export class TrackClip extends ClipEditorClip {
  static styles = [
    ...ClipEditorClip.styles,
    styles
  ];

  @property()
  midiTrackClip: MidiTrackClip;

  private _recording: boolean = false;
  public get recording() {
    return this._recording;
  }
  public set recording(v) {
    if (this._recording === v) return;
    this._recording = v;
    if (v) {
      this._recordTick();
      Recorder.on('stopRecording', () => this.remove());
    }
  }


  get mc() {
    if (!this.midiTrackClip) return null;
    return this.midiTrackClip.midiClip;
  }

  get mt() {
    if (!this.midiTrackClip) return null;
    return this.midiTrackClip.midiTrack;
  }

  get mtc() {
    if (!this.midiTrackClip) return null;
    return this.midiTrackClip.midiTrackClip;
  }

  protected _start: number;
  public get start() { return this._start; }
  public set start(v: number) {
    this._start = v;
    if (this.mtc) this.mtc.start = v;
    this._updatePosition();
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v: number) {
    this._duration = v;
    if (this.mtc) this.mtc.duration = v;
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

    if (props.has('midiTrackClip')) {
      proxa(this.mc!.notes, () => {
        this._updateMap();
        this.draw()
      });
    }
  }

  render() {
    return html`
      <header>${this.mc ? this.mc.midiClipObject.name : ''}</header>
      <canvas></canvas>
    `;
  }

  private _updateMap() {
    if (!this.mc) return false;
    this._noteRows.clear();
    this.mc.notes.forEach(n => {
      this._noteRows.set(n, noteToRow(n.n));
    });
    return true;
  }

  private draw() {
    const c = this._canvas;
    const { width, height } = getComputedStyle(c);
    const w = c.width = parseInt(width!);
    const h = c.height = parseInt(height!);

    const ctx = c.getContext('2d')!;

    const notes = Array.from(this._noteRows.entries());
    const rows = notes.map(([, row]) => row);
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


  private _recordTick() {
    if (!Recorder.recording) return this.recording = false;
    if (!this.recording) return;

    const t = Clock.currentBeatExact;
    const duration = t - this.start!;
    this.duration = duration;
    this._updateMap();
    if (this._canvas) this.draw();


    window.requestAnimationFrame(this._recordTick.bind(this));
    return;
  }
}
