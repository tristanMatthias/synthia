import { ESynthiaProjectSynthNodeDelay } from '@synthia/api';

import { SynthiaDelay } from '../../../audioNodes/Delay';
import { iconEffectDelay } from '../../../images/icons/effectDelay';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../SynthBaseEffect/BaseEffect';
import { DelaySidebar } from './DelaySidebar';

export * from './DelaySidebar';

export class Delay extends BaseEffectClass<DelaySidebar, ESynthiaProjectSynthNodeDelay, SynthiaDelay> {

  multipleConnections = false;

  protected _sidebarType = SElement.delaySidebar;
  protected _icon = iconEffectDelay;

  protected _updateValues() {
    const m = this.synthNode!;
    this.audioNode.delayTime.value = m.properties.delayTime;
    this.audioNode.feedback.value = m.properties.feedback;
    this.audioNode.dryWet = m.properties.dryWet;
    this.requestUpdate();
  }
}


window.customElements.define(SElement.delay, baseEffectMix(Delay));
