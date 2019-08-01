import { iconEffectPan } from '../../../images/icons/effectPan';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../BaseEffect/BaseEffect';
import { PanSidebar } from './PanSidebar';

export * from './PanSidebar';

export class Pan extends BaseEffectClass<PanSidebar> {

  panner = this._ctx.createStereoPanner();
  multipleConnections = false;
  output = this.panner;
  input = this.panner;


  protected _sidebarType = SElement.panSidebar;
  protected _icon = iconEffectPan;
  protected _canvas = true;

  get pan() {
    return this.panner.pan.value;
  }
  set pan(v: number) {
    this.panner.pan.value = v;
    this.requestUpdate();
  }


  updated(props: Map<keyof Pan, any>) {
    super.updated(props);
    this._drawFrequencyArc();
  }

  private _drawFrequencyArc() {
    const size = 120;
    const ctx = this.shadowRoot!.querySelector('canvas')!.getContext('2d')!;
    const lineWidth = 6;
    const perc = (this.pan + 1) / 2;
    const offsetDeg = 17; // Creates the curved look
    const start = (180 - offsetDeg) / (180 / Math.PI);
    const end = (360 + offsetDeg) / (180 / Math.PI);


    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, start, end);
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-main');;
    ctx.stroke();


    // Halfway between
    let lineStart = ((end + start) / 2)
    // Percentage of different, plus the start offset
    let lineEnd = ((end - start) * perc) + start;

    if (lineEnd < lineStart) {
      let temp = lineStart;
      lineStart = lineEnd;
      lineEnd = temp;
    }

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, lineStart, lineEnd);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-alt');;
    ctx.stroke();
  }
}


window.customElements.define(SElement.pan, baseEffectMix(Pan));
