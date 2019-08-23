import { LitElement } from 'lit-element';

import CompositeAudioNode from '../../../audioNodes/BaseNode';
import { ctx } from '../../../lib/AudioContext';
import { SElement } from '../../../types';
import { proxa } from 'proxa';

export class BaseNode<SN extends object, AN extends AudioNode | CompositeAudioNode> extends LitElement {

  protected _synth = document.querySelector(SElement.synthPage)!;
  protected readonly _ctx = ctx;
  protected _toaster = document.querySelector(SElement.toaster)!;

  audioNode: AN;

  protected _synthNode?: SN;
  get synthNode() {
    return this._synthNode;
  }
  set synthNode(sn: SN | undefined) {
    if (sn && sn !== this._synthNode) {
      this._synthNode = proxa(sn, () => {
        this._updateValues();
      });
      this._updateValues();
    }
  }

  protected _updateValues() { }

}
