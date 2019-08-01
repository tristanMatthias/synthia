import { ReverbEffect } from '../../../audioNodes/Reverb';
import { iconEffectReverb } from '../../../images/icons/effectReverb';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../BaseEffect/BaseEffect';
import { ReverbSidebar } from './ReverbSidebar';

export * from './ReverbSidebar';

export class Reverb extends BaseEffectClass<ReverbSidebar> {

  reverb: ReverbEffect = this._ctx.createReverb();
  multipleConnections = false;
  output = this.reverb;
  input = this.reverb;


  protected _sidebarType = SElement.reverbSidebar;
  protected _icon = iconEffectReverb;


  get roomSize() {
    return this.reverb.roomSize;
  }
  set roomSize(v: number) {
    if (this.reverb) this.reverb.roomSize = v;
    this.requestUpdate();
  }

  get decayTime() {
    return this.reverb.decayTime;
  }
  set decayTime(v: number) {
    if (this.reverb) this.reverb.decayTime = v;
    this.requestUpdate();
  }

  get fadeInTime() {
    return this.reverb.fadeInTime;
  }
  set fadeInTime(v: number) {
    if (this.reverb) this.reverb.fadeInTime = v;
    this.requestUpdate();
  }

  get dryWet() {
    return this.reverb.dryWet;
  }
  set dryWet(v: number) {
    if (this.reverb) this.reverb.dryWet = v;
    this.requestUpdate();
  }
}


window.customElements.define(SElement.reverb, baseEffectMix(Reverb));
