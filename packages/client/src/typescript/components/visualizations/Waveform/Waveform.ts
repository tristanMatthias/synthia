import { html, LitElement, property, query } from 'lit-element';

import { Connectable } from '../../../lib/mixins/Connectable/Connectable';
import { Receivable } from '../../../lib/mixins/Receivable/Receivable';
import { remToPx } from '../../../lib/pxToRem';
import { SElement } from '../../../types';
import styles from './waveform.styles';
import { SynthPageEvents } from '../../pages/synth/synth.page';
import { ctx } from '../../../lib/AudioContext';


export class Waveform extends LitElement {
  static get styles() {
    return [styles]
  }

  private _synth = document.querySelector(SElement.synthPage)!;
  private _ctx = ctx;

  analyser = this._ctx.createAnalyser();
  connectedTo?: Receivable;
  connectedFrom?: Connectable;

  @property({ reflect: true, type: Boolean })
  removable: boolean = false;
  private _removing: boolean = false;

  private _bufferLength: number;
  private _dataArray: Uint8Array;
  private _canvasCtx?: CanvasRenderingContext2D;
  private _toaster = document.querySelector(SElement.toaster)!;
  private _lastNotified = Date.now();


  get input() { return this.analyser; }
  get output() { return this.analyser; }



  get inactive() {
    const len = this._dataArray.length;
    if (!len) return false;


    return this._dataArray[0] == 128 &&
      this._dataArray[len - 1] == 128;
  }

  constructor() {
    super();

    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.3;
    this._bufferLength = this.analyser.frequencyBinCount;
    this._dataArray = new Uint8Array(this._bufferLength);

    this._draw = this._draw.bind(this);
    this.disconnect = this.disconnect.bind(this);

  }

  @query('canvas')
  canvas?: HTMLCanvasElement;


  @property({reflect: true})
  color?: string;

  @property({reflect: true})
  width: number = 40;

  @property({reflect: true})
  height: number = 6;

  render() {
    return html`<canvas width="${remToPx(this.width)}px" height="${remToPx(this.height)}px"></canvas>`;
  }

  firstUpdated() {
    this._canvasCtx = this.canvas!.getContext('2d')!;
    this._draw();
    this._synth.addEventListener(SynthPageEvents.redraw, () => this.requestUpdate());
  }


  connect(node: AudioNode) {
    this.analyser.connect(node);
  }

  disconnect() {
    if (!this.connectedFrom || !this.connectedTo) throw new Error('Waveform is not connected');
    this.connectedFrom.disconnectFrom(this.connectedTo);
    this._removing = false;
  }

  connectedCallback() {
    super.connectedCallback()

    // If single clicked, instruct the user to double click\
    if (this.removable) {

      this.addEventListener('click', (e) => {
        setTimeout(() => {
          if (!this._removing && this.style.display !== 'none') this._instruct();
        }, 500);
      });

      this.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this._removing = true;
        this.disconnect();
      });
    }
  }


  private _draw() {
    if (this.isConnected) window.requestAnimationFrame(this._draw);
    const canvas = this.canvas!;
    const ctx = this._canvasCtx!;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    this.analyser.getByteTimeDomainData(this._dataArray);

    ctx.lineWidth = 2;

    if (!this.inactive) {
      ctx.setLineDash([1, 0]);
      ctx.globalAlpha = 1;
    } else {
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.2;
    }

    ctx.strokeStyle = this.color || getComputedStyle(document.documentElement).getPropertyValue('--color-text');
    ctx.beginPath();

    const sliceWidth = width * 1.0 / this._bufferLength;
    let x = 0;

    for (let i = 0; i < this._bufferLength; i++) {

      const v = this._dataArray[i] / 128.0;
      const y = (v * (height - 2) / 2);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }


  private _instruct() {
    if ((Date.now() - this._lastNotified) / 1000 > 3) {
      this._toaster.info('Double click a connection to remove it');
      this._lastNotified = Date.now();
    }
  }

}

window.customElements.define(SElement.waveform, Waveform);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.waveform]: Waveform;
  }
}
