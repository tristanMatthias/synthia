import { customElement, html, property, query } from 'lit-element';
import { Waveform } from 'tone';

import { AudioTrackClip } from '../../../../../../../lib/AudioTrack/AudioTrackClip';
import { Clock } from '../../../../../../../lib/Clock';
import { RecordController } from '../../../../../../../lib/RecordController';
import { SElement } from '../../../../../../../types';
import { ClipEditorClip } from '../../../../../../visualizations/ClipEditor/Clip/Clip';
import styles from './track-audio-clip.styles';

@customElement(SElement.audioTrackClip)
export class AudioTrackClipElement extends ClipEditorClip {
  static styles = [
    ...ClipEditorClip.styles,
    styles
  ];

  @property()
  audioTrackClip: AudioTrackClip;

  private _wf = new Waveform(32);
  private _waveformAnalysis: number[];
  private _ctx: CanvasRenderingContext2D;
  private _history: { amp: number, time: number }[] = [];

  private _recording: boolean = false;
  public get recording() {
    return this._recording;
  }
  public set recording(v) {
    if (this._recording === v) return;
    this._recording = v;
    if (v) {
      this._recordTick();
      RecordController.on('stopRecording', () => this.remove());
      if (this.at) this.at.media.connect(this._wf);
    }
  }


  get ac() {
    if (!this.audioTrackClip) return null;
    return this.audioTrackClip.audioClip;
  }

  get at() {
    if (!this.audioTrackClip) return null;
    return this.audioTrackClip.audioTrack;
  }

  get atc() {
    if (!this.audioTrackClip) return null;
    return this.audioTrackClip.audioTrackClip;
  }

  protected _start: number;
  public get start() { return this._start; }
  public set start(v: number) {
    this._start = v;
    if (this.atc) this.atc.start = v;
    this._updatePosition();
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v: number) {
    this._duration = v;

    if (this.atc) this.atc.duration = v;
    if (this.ac && this.recording) this.ac.audioClipObject.duration = v;

    this._updatePosition();
    if (this.isConnected) this.draw();
  }

  @query('canvas')
  private _canvas: HTMLCanvasElement;

  render() {
    return html`
      <header>${this.ac ? this.ac.audioClipObject.name : ''}</header>
      <canvas></canvas>
    `;
  }

  firstUpdated(props: Map<string, keyof AudioTrackClipElement>) {
    // @ts-ignore
    super.firstUpdated(props);
    this._ctx = this._canvas.getContext('2d')!;
    this.ac!.on('loaded', this.draw.bind(this));
  }


  private _computeRMS(buffer: Tone.Buffer, width: number) {
    if (this._waveformAnalysis && this._waveformAnalysis.length === width) return;

    const array = buffer.toArray(0) as Float32Array;
    const length = 64
    const rmses = []
    for (let i = 0; i < width; i++) {
      // @ts-ignore
      const offsetStart = Math.floor(Math.scale(i, 0, width, 0, array.length - length))
      const offsetEnd = offsetStart + length
      let sum = 0
      for (let s = offsetStart; s < offsetEnd; s++) {
        sum += Math.pow(array[s], 2)
      }
      const rms = Math.sqrt(sum / length)
      rmses[i] = rms
    }
    const max = Math.max(...rmses)
    // @ts-ignore
    this._waveformAnalysis = rmses.map(v => Math.scale(Math.pow(v, 0.8), 0, max, 0, 1))
  }


  private draw() {
    const c = this._canvas;
    const { width, height } = getComputedStyle(c);
    const w = c.width = parseInt(width!);
    const h = c.height = parseInt(height!);

    this._ctx.clearRect(0, 0, w, h);

    if (this._recording) {
      const ct = Clock.currentTime;
      const start = Clock.timeAtBeat(this.start);


      this._ctx.beginPath();
      this._ctx.lineWidth = 1;

      this._history.forEach((v, i) => {
        const x = ((v.time) / (ct - start)) * w;
        // @ts-ignore
        const y = Math.scale(v.amp, -1, 1, 0, h)
        if (i === 0) this._ctx.moveTo(x, y)
        else this._ctx.lineTo(x, y)
      });

      this._ctx.lineCap = 'round';
      this._ctx.strokeStyle = 'white';
      this._ctx.stroke();


    } else {
      const buffer = this.ac!.buffer;
      if (buffer.loaded) {
        this._computeRMS(buffer, w);
        this._ctx.fillStyle = 'white';
        this._waveformAnalysis.forEach((val, i) => {
          const barHeight = val * h
          const x = i;
          this._ctx.fillRect(x, h / 2 - barHeight / 2, 1, barHeight)
          this._ctx.fill()
        })
      }
    }
  }


  private _recordTick() {
    if (!RecordController.recording) return this.recording = false;
    if (!this.recording) return;

    const t = Clock.currentBeatExact;
    const duration = t - this.start!;
    this.duration = duration;


    this._history.push(...peaks(this._wf.getValue(), Clock.timeAtBeat(this.start)));
    if (this._canvas) this.draw();

    window.requestAnimationFrame(this._recordTick.bind(this));
    return;
  }
}


const peak = (arr: readonly number[], start: number) => {
  let amp;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const flipped = min < 0 ? min * -1 : min;

  amp = (max > flipped) ? max : min;
  return { amp, time: Clock.currentTime - start }
}

const peaks = (arr: readonly number[], start: number) => {
  const half = (arr.length / 2);
  return [peak(arr.slice(0, half), start), peak(arr.slice(half), start)]
}
