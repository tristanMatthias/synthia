import { LitElement } from 'lit-element';

import CompositeAudioNode from '../../../audioNodes/BaseNode';
import { ctx } from '../../../lib/AudioContext';
import { SElement } from '../../../types';
import { proxa } from 'proxa';

export class BaseNode<T extends object> extends LitElement {

  protected _synth = document.querySelector(SElement.synthPage)!;
  protected readonly _ctx = ctx;
  protected _toaster = document.querySelector(SElement.toaster)!;

  input: AudioNode | CompositeAudioNode = this._ctx.createGain();
  output: AudioNode | CompositeAudioNode = this._ctx.createGain();

  _model?: T;
  get model() {
    return this._model;
  }
  set model(m: T | undefined) {
    if (m && m !== this._model) {
      this._model = proxa(m, () => {
        this._updateValues();
      });
      this._updateValues();
    }
  }

  protected _updateValues() { }

}
