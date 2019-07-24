import { LitElement, html, customElement, property } from "lit-element";
import { SElement } from "../../types";
import { Selectable } from "../../mixins/Selectable/Selectable";

export enum AppEvents {
  connecting = 'connecting'
}

@customElement(SElement.app)
export class App extends LitElement {

  context = new AudioContext();
  mainWaveform = document.querySelector(SElement.waveform)!;

  private _selected: Selectable[] = [];

  @property()
  isDragging: boolean = false;


  private _isConnecting: boolean = false;
  public get isConnecting(): boolean {
    return this._isConnecting;
  }
  public set isConnecting(v: boolean) {

    this._isConnecting = v;
    (Array.from(this.querySelectorAll(`${SElement.canvas} > *`)) as HTMLElement[])
      // @ts-ignore
      .filter(e => !e.canReceive && !e._connecting)
      .forEach(e => e.style.opacity = v ? '0.2' : '1')


    this.requestUpdate();
  }



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


  deselect(element?: Selectable) {
    if (!element) {
      this._selected.forEach(e => e.selected = false);
      this._selected = [];
    } else {
      const index = this._selected.indexOf(element);
      if (index > -1) this._selected.splice(index, 1);
      element.selected = false;
    }
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
