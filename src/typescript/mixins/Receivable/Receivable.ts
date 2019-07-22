import { LitElement } from "lit-element";

export interface Receivable extends LitElement {
  connect(audioNode: AudioNode): void;

  canReceive: true;
}



export const ReceivableMixin = (superclass: new () => LitElement) =>
  class Receivable extends superclass implements Receivable {
    canReceive = true
  }
