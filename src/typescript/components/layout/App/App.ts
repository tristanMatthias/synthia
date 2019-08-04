import { customElement, html, LitElement, property, query } from 'lit-element';

import { Selectable } from '../../../lib/mixins/Selectable/Selectable';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { Keyboard } from '../../visualizations/Keyboard/Keyboard';

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

  private _toaster = document.querySelector(SElement.toaster)!;

  @query(SElement.keyboard)
  keyboard?: Keyboard;



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

  firstUpdated() {
    if (!Storage.get(StorageKey.notifiedIntro)) {
      this._toaster.info('Welcome to Synthia! Find your sound by dragging a node onto the canvas');
      Storage.set(StorageKey.notifiedIntro, true)
    }
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}