import { SynthiaDelay } from '../../../audioNodes/Delay';
import { iconEffectDelay } from '../../../images/icons/effectDelay';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../BaseEffect/BaseEffect';
import { DelaySidebar } from './DelaySidebar';

export * from './DelaySidebar';

export class Delay extends BaseEffectClass<DelaySidebar> {

  delay: SynthiaDelay = new SynthiaDelay(this._ctx);
  multipleConnections = false;
  output = this.delay;
  input = this.delay;


  protected _sidebarType = SElement.delaySidebar;
  protected _icon = iconEffectDelay;


  get delayTime() {
    return this.delay.delayTime.value;
  }
  set delayTime(v: number) {
    if (this.delay) this.delay.delayTime.setValueAtTime(v, this._ctx.currentTime);
    this.requestUpdate();
  }

  get feedback() {
    return this.delay.feedback.value;
  }
  set feedback(v: number) {
    if (this.delay) this.delay.feedback.setValueAtTime(v, this._ctx.currentTime);
    this.requestUpdate();
  }
}


window.customElements.define(SElement.delay, baseEffectMix(Delay));
