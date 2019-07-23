import { LitElement, html, customElement, property } from "lit-element";
import { SElement } from "../../types";
import { Selectable } from "../../mixins/Selectable/Selectable";

@customElement(SElement.app)
export class App extends LitElement {

  context = new AudioContext();
  mainWaveform = document.querySelector(SElement.waveform)!;

  private _selected: Selectable[] = [];


  @property()
  isConnecting: boolean = false;

  @property()
  isDragging: boolean = false;


  render() { return html`<slot></slot>`; }

  select(element: Selectable, multiple = false) {
    if (multiple) {
      if (!this._selected.includes(element)) {
        this._selected.push(element);
        element.selected = true;
      }
    } else {
      this._selected.forEach(e => e.selected = false);
      this._selected = [element];
      element.selected = true;
    }
  }

  deselect(element: Selectable) {
    const index = this._selected.indexOf(element);
    if (index > -1) this._selected.splice(index, 1);
    element.selected = false;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
