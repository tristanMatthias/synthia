import { ReverbEffect } from '../../../audioNodes/Reverb';
import { iconEffectReverb } from '../../../images/icons/effectReverb';
import { SynthiaFileSynthNodeReverb } from '../../../lib/File/file.type';
import { SElement } from '../../../types';
import { BaseEffectClass, baseEffectMix } from '../SynthBaseEffect/BaseEffect';
import { ReverbSidebar } from './ReverbSidebar';

export * from './ReverbSidebar';

export class Reverb extends BaseEffectClass<ReverbSidebar, SynthiaFileSynthNodeReverb> {

  protected _updateValues() {
    const m = this.model!;
    this.output.roomSize = m.properties.roomSize;
    this.output.decayTime = m.properties.decayTime;
    this.output.fadeInTime = m.properties.fadeInTime;
    this.output.dryWet = m.properties.dryWet;
    this.requestUpdate();
  }

  reverb: ReverbEffect = this._ctx.createReverb();
  multipleConnections = false;
  output = this.reverb;
  input = this.reverb;


  protected _sidebarType = SElement.reverbSidebar;
  protected _icon = iconEffectReverb;
}


window.customElements.define(SElement.reverb, baseEffectMix(Reverb));
