import { LitElement } from "lit-element";

export interface Receivable extends LitElement {
  connect(audioNode: AudioNode): boolean;
  disconnect(audioNode: AudioNode): boolean;

  canReceive: boolean;
  input: AudioNode;
}



export const ReceivableMixin = (superclass: new () => LitElement) =>
  class Receivable extends superclass implements Receivable {
    canReceive = true;
    input?: AudioNode

    connect(node: AudioNode) {
      if (!this.input) throw new Error('No input audio node');
      node.connect(this.input);
      return true;
    }

    disconnect(node: AudioNode) {
      if (!this.input) throw new Error('No input audio node');
      node.disconnect(this.input);
      return true;
    }
  }
