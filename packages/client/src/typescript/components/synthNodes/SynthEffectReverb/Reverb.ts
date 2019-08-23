import { ESynthiaProjectSynthNodeReverb } from '@synthia/api';
import { SynthiaReverb } from '../../../audioNodes/Reverb';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../SynthBaseEffect/BaseEffect';
import { ReverbSidebar } from './ReverbSidebar';



export * from './ReverbSidebar';

export class Reverb extends BaseEffectClass<ReverbSidebar, ESynthiaProjectSynthNodeReverb, SynthiaReverb> {

  protected _updateValues() {
    const m = this.synthNode!;
    this.audioNode.roomSize = m.properties.roomSize;
    this.audioNode.decayTime = m.properties.decayTime;
    this.audioNode.fadeInTime = m.properties.fadeInTime;
    this.audioNode.dryWet = m.properties.dryWet;
    this.requestUpdate();
  }

  multipleConnections = false;

  protected _sidebarType = SElement.reverbSidebar;
  protected _icon = 'effectReverb';
}


window.customElements.define(SElement.reverb, baseEffectMix(Reverb));
