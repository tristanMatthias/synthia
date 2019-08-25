import { ESynthiaProjectSynthNodeReverb } from '@synthia/api';

import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../SynthBaseEffect/BaseEffect';
import { ReverbSidebar } from './ReverbSidebar';
import { SynthiaReverb } from '../../../lib/effects/Reverb';

export * from './ReverbSidebar';

export class Reverb extends BaseEffectClass<ReverbSidebar, ESynthiaProjectSynthNodeReverb, SynthiaReverb> {

  protected _updateValues() {
    const m = this.synthNode!;
    this.audioNode.roomSize = m.properties.roomSize;
    this.audioNode.decayTime = m.properties.decayTime;
    this.audioNode.fadeInTime = m.properties.fadeInTime;
    this.requestUpdate();
  }

  multipleConnections = false;

  protected _sidebarType = SElement.reverbSidebar;
  protected _icon = 'effectReverb';
}


window.customElements.define(SElement.reverb, baseEffectMix(Reverb));
