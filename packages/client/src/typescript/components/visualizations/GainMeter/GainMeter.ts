import { customElement, html, LitElement, property, query } from 'lit-element';
import { Master } from 'tone';

import { SElement } from '../../../types';
import styles from './gain-meter.styles';
import gradient from 'tinygradient';

const meterGradient = gradient([
  { color: '#080', pos: 0 },
  { color: 'lime', pos: 0.55},
  { color: '#ff0', pos: 0.84 },
  { color: 'red', pos: 1 }
]);

@customElement(SElement.gainMeter)
export class GainMeter extends LitElement {
  static styles = [styles];

  title = 'Volume'

  @property({ type: Number, reflect: true })
  dbRange: number = 48;

  @property({ type: Number })
  value: number = 1;

  // @ts-ignore
  meterNode: ScriptProcessorNode = Master.context.rawContext.createScriptProcessor(2048, 2, 2);

  private _maskSizes: [number, number] = [0, 0];
  private _channelCount: number = 2;
  private _channelPeaks: number[] = [];
  private _channelMaxes: number[] = [];


  @query('canvas.left')
  private _canvasLeft: HTMLCanvasElement;
  @query('canvas.right')
  private _canvasRight: HTMLCanvasElement;


  private get _meterHeight() {
    const c = this._canvasLeft;
    if (!c) return 0;
    return parseInt(getComputedStyle(c).height!);
  }

  constructor() {
    super();
    this.meterNode.onaudioprocess = this._updateMeter.bind(this);
    // @ts-ignore;
    this.meterNode.connect(Master.context.rawContext.destination);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('wheel', e => {
      this.value -= (e.deltaY / 100);
      if (this.value < 0) this.value = 0;
      if (this.value > 1) this.value = 1;
      this.dispatchEvent(new CustomEvent('change', {
        detail: this.value
      }));
    });
  }

  render() {
    return html`
      <canvas class="left"></canvas>
      <canvas class="right"></canvas>
      <s-slider vertical handle min=${0} max=${1} .value=${this.value}></s-slider>
    `;
  }

  firstUpdated(props: Map<string, keyof GainMeter>) {
    super.firstUpdated(props);
    this.draw();
  }

  private draw() {

    const cl = this._canvasLeft;
    const cr = this._canvasRight;
    const { width, height } = getComputedStyle(cl);
    const w = cl.width = parseInt(width!);
    const h = cl.height = parseInt(height!);

    cl.width = cr.width = w;
    cl.height = cr.height = h;

    const ctxL = cl.getContext('2d')!;
    const ctxR = cr.getContext('2d')!;

    ctxL.clearRect(0, 0, w, h);
    ctxR.clearRect(0, 0, w, h);

    ctxL.fillStyle = meterGradient.hsvAt(this._maskSizes[0] / h).toRgbString();
    ctxR.fillStyle = meterGradient.hsvAt(this._maskSizes[1] / h).toRgbString();
    ctxL.fillRect(0, h, w, -1 * this._maskSizes[0]);
    ctxR.fillRect(0, h, w, -1 * this._maskSizes[1]);


    window.requestAnimationFrame(this.draw.bind(this));
  }


  private _updateMeter(audioProcessingEvent: AudioProcessingEvent) {
    const inputBuffer = audioProcessingEvent.inputBuffer;
    const channelData = [];

    for (let i = 0; i < this._channelCount; i++) {
      channelData[i] = inputBuffer.getChannelData(i);

      this._channelMaxes[i] = 0.0;
    }

    for (var sample = 0; sample < inputBuffer.length; sample++) {
      for (let i = 0; i < inputBuffer.numberOfChannels; i++) {
        if (Math.abs(channelData[i][sample]) > this._channelMaxes[i]) {
          this._channelMaxes[i] = Math.abs(channelData[i][sample]);
        }
      }
    }

    for (let i = 0; i < inputBuffer.numberOfChannels; i++) {
      this._maskSizes[i] = this._maskSize(this._channelMaxes[i]);

      if (this._channelMaxes[i] > this._channelPeaks[i]) {
        this._channelPeaks[i] = this._channelMaxes[i];
        // textLabels[i] = this._dbFromFloat(this._channelPeaks[i]).toFixed(1);
      }
    }
  };


  private _getBaseLog(x: number, y: number) {
    return Math.log(y) / Math.log(x);
  };

  private _dbFromFloat(floatVal: number) {
    return this._getBaseLog(10, floatVal) * 20;
  };


  private _maskSize(floatVal: number) {
    const h = this._meterHeight;
    let v;
    if (floatVal === 0.0) v = h;
    else {
      const d = this.dbRange * -1;
      const returnVal = Math.floor(this._dbFromFloat(floatVal) * h / d);
      if (returnVal > h) v = h;
      else v = returnVal;
    };

    return h - v;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.gainMeter]: GainMeter;
  }
}
