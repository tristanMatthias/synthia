import { LitElement } from "lit-element";
import CompositeAudioNode from "../../../audioNodes/BaseNode";

export interface Receivable extends LitElement {
  connect(audioNode: AudioNode): boolean;
  disconnect(audioNode: AudioNode): boolean;

  canReceive: boolean;
  input: AudioNode | CompositeAudioNode;
}


export enum ReceivableEvents {
  removed = 'removed'
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

      try {
        node.disconnect(this.input);
        return true;
      } catch (e) {
        // Not connected
        return false;
      }
    }

    disconnectedCallback() {
      this.dispatchEvent(new CustomEvent(ReceivableEvents.removed));
      if (this.input) this.input.disconnect();
      super.disconnectedCallback();
    }
  }
