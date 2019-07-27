import { html, LitElement, query } from 'lit-element';

import { iconEffect } from '../../icons/effect';
import { iconEffectDelay } from '../../icons/effectDelay';
import { Connectable, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { mix } from '../../mixins/mix';
import { Receivable, ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import styles from './delay.styles';

export class Delay extends LitElement implements Connectable, Receivable {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo() { return Promise.resolve(true) }
  disconnectFrom() { return Promise.resolve(true) }
  // Receiveable
  canReceive = true
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;
  @query('.background')
  _menuHoverItem?: HTMLElement;


  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  delay: DelayNode = this.ctx.createDelay();
  multipleConnections = false;
  get output() {
    return this.delay;
    // return this.shadowRoot!.querySelector(SElement.waveform)!.analyser;
  }
  get input() {
    return this.delay;
  }
  connect() { return true };
  disconnect() { return true }


  constructor() {
    super();
    this.delay = this.ctx.createDelay();
    this.delay.delayTime.setValueAtTime(10, this.ctx.currentTime);
  }


  render() {
    return html`
    <div class="background">${iconEffect}</div>
    <div class="icon">${iconEffectDelay}</div>`;
  }
}


const delay = mix(Delay, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  // HasCircleMenuMixin
])


window.customElements.define(SElement.delay, delay);
