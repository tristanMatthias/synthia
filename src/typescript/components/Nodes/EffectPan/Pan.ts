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


  get pan() {
    return this.panner.pan.value;
  }
  set pan(v: number) {
    this.panner.pan.value = v;
    this.requestUpdate();
  }
}


window.customElements.define(SElement.pan, baseEffectMix(Pan));
