import { LitElement, html, customElement, property } from "lit-element";
import { SElement } from "../../types";

@customElement(SElement.app)
export class App extends LitElement {

  context = new AudioContext();
  mainWaveform = document.querySelector(SElement.waveform)!;


  @property()
  isConnecting: boolean = false;

  @property()
  isDragging: boolean = false;


  render() { return html`<slot></slot>`; }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
