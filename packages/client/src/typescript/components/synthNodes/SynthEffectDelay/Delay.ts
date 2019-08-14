import {ESynthiaProjectSynthNodeDelay} from '@synthia/api';
import { SynthiaDelay } from '../../../audioNodes/Delay';
import { iconEffectDelay } from '../../../images/icons/effectDelay';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../SynthBaseEffect/BaseEffect';
import { DelaySidebar } from './DelaySidebar';

export * from './DelaySidebar';

export class Delay extends BaseEffectClass<DelaySidebar, ESynthiaProjectSynthNodeDelay> {

  delay: SynthiaDelay = new SynthiaDelay(this._ctx);
  multipleConnections = false;
  output = this.delay;
  input = this.delay;


  protected _sidebarType = SElement.delaySidebar;
  protected _icon = iconEffectDelay;


  protected _updateValues() {
    const m = this.model!;
    this.output.delayTime.value = m.properties.delayTime;
    this.output.feedback.value = m.properties.feedback;
    this.output.dryWet = m.properties.dryWet;
    this.requestUpdate();
  }
}


window.customElements.define(SElement.delay, baseEffectMix(Delay));
