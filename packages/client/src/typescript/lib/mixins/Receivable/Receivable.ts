import { LitElement } from "lit-element";
import CompositeAudioNode from "../../../audioNodes/BaseNode";

export interface Receivable extends LitElement {
  connect(audioNode: AudioNode): boolean;
  disconnect(audioNode: AudioNode): boolean;

  canReceive: boolean;
  audioNode: AudioNode | CompositeAudioNode;
}


export enum ReceivableEvents {
  removed = 'removed'
}


export const ReceivableMixin = (superclass: new () => LitElement) =>
  class Receivable extends superclass implements Receivable {
    canReceive = true;
    audioNode?: AudioNode

    // connect(node: AudioNode) {
    //   if (!this.audioNode) throw new Error('No audio node');
    //   node.connect(this.audioNode);
    //   return true;
    // }

    // disconnect(node: AudioNode) {
    //   if (!this.audioNode) throw new Error('No audio node');

    //   try {
    //     node.disconnect(this.audioNode);
    //     return true;
    //   } catch (e) {
    //     // Not connected
    //     return false;
    //   }
    // }

    remove() {
      this.dispatchEvent(new CustomEvent(ReceivableEvents.removed));
      super.remove();
    }

    disconnectedCallback() {
      // if (this.audioNode) this.audioNode.disconnect();
      super.disconnectedCallback();
    }
  }
