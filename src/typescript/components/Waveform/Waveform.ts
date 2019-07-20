import { html, LitElement, query, property } from 'lit-element';

import { SElement } from '../../types';
import styles from './Waveform.styles';


export class Waveform extends LitElement {
  static get styles() {
    return [styles]
  }

  private _root = document.querySelector(SElement.root)!
  private _ctx = this._root.context

  analyser = this._ctx.createAnalyser();

  private _bufferLength: number;
  private _dataArray: Uint8Array;
  private _canvasCtx?: CanvasRenderingContext2D;

  constructor() {
    super();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.3;
    this._bufferLength = this.analyser.frequencyBinCount;
    this._dataArray = new Uint8Array(this._bufferLength);

    this._draw = this._draw.bind(this);
  }

  @query('canvas')
  canvas?: HTMLCanvasElement;


  @property({reflect: true})
  color: string = "#7d83df";

  @property({reflect: true})
  width: number = 400;

  @property({reflect: true})
  height: number = 60;

  render() {
    return html`<canvas width="${this.width}px" height="${this.height}px"></canvas>`;
  }

  firstUpdated() {
    this._canvasCtx = this.canvas!.getContext('2d')!;
    this._draw();
  }


  connect(node: AudioNode) {
    this.analyser.connect(node);
  }


  private _draw() {
    window.requestAnimationFrame(this._draw);
    const canvas = this.canvas!;
    const ctx = this._canvasCtx!;

    ctx.clearRect(0, 0, this.width, this.height);
    this.analyser.getByteTimeDomainData(this._dataArray);

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    const sliceWidth = this.width * 1.0 / this._bufferLength;
    let x = 0;

    for (var i = 0; i < this._bufferLength; i++) {

      var v = this._dataArray[i] / 128.0;
      var y = (v * (this.height - 2) / 2);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

}

window.customElements.define(SElement.waveform, Waveform);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.waveform]: Waveform;
  }
}
