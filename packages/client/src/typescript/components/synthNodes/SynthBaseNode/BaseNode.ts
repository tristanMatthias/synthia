import { LitElement } from 'lit-element';
import { proxa } from 'proxa';
import { ToneNode } from '../../../lib/Instruments/Synth/createToneNode';
import { SElement } from '../../../types';

export class BaseNode<SN extends object, TN extends ToneNode> extends LitElement {

  protected _synth = document.querySelector(SElement.synthPage)!;
  protected _toaster = document.querySelector(SElement.toaster)!;

  audioNode: TN;

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
