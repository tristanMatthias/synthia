import { LitElement } from 'lit-element';

import { ToneNode } from '../../Instruments/Synth/createToneNode';

export interface Receivable extends LitElement {
  connect(audioNode: AudioNode): boolean;
  disconnect(audioNode: AudioNode): boolean;

  canReceive: boolean;
  audioNode: ToneNode;
}


export enum ReceivableEvents {
  removed = 'removed'
}


export const ReceivableMixin = (superclass: new () => LitElement) =>
  class Receivable extends superclass implements Receivable {
    canReceive = true;
    audioNode?: AudioNode;

    remove() {
      this.dispatchEvent(new CustomEvent(ReceivableEvents.removed));
      super.remove();
    }
  }
