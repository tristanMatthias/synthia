import { html, LitElement, query } from 'lit-element';

import { iconEffect } from '../../icons/effect';
import { iconEffectReverb } from '../../icons/effectReverb';
import { ReverbEffect } from '../../lib/filters/Reverb';
import { Storage, StorageKey } from '../../lib/Storage';
import { Connectable, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { mix } from '../../mixins/mix';
import { Receivable, ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableMixin, SelectableEvents } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { SidebarEvents } from '../Sidebar/Sidebar';
import styles from './reverb.styles';
import { ReverbSidebar } from './ReverbSidebar/ReverbSidebar';

export class Reverb extends LitElement implements Connectable, Receivable {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo() { return Promise.resolve(true) }
  disconnectFrom() { return Promise.resolve(true) }
  // Receivable
  canReceive = true
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;
  @query('.background')
  _menuHoverItem?: HTMLElement;


  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  reverb: ReverbEffect = this.ctx.createReverb();
  multipleConnections = false;
  get output() {
    return this.shadowRoot!.querySelector(SElement.waveform)!.analyser;
  }
  get input() {
    return this.reverb;
  }
  connect() { return true };
  disconnect() { return true }


  private _toaster = document.querySelector(SElement.toaster)!;
  private _sidebar: ReverbSidebar | null = null;


  render() {
    return html`
    <div class="background">${iconEffect}</div>
    <div class="icon">${iconEffectReverb}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
  }

  firstUpdated(props: Map<keyof Reverb, any>) {
    super.firstUpdated(props);
    this.reverb.connect(this.output);
  }


  toggleSidebar(forceRemove?: boolean) {
    if (this._sidebar || forceRemove) {
      if (this._sidebar) this._sidebar.remove();
      this._sidebar = null;
    } else {
      const sidebar = new ReverbSidebar();
      sidebar.reverb = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;

      if (!Storage.get(StorageKey.notifiedFilterSidebar)) {
        this._toaster.info('Pro tip: You can open the Filter settings by double clicking on the reverb');
        Storage.set(StorageKey.notifiedFilterSidebar, true)
      }
    }
  }


  get roomSize() {
    return this.reverb.roomSize;
  }
  set roomSize(v: number) {
    if (this.reverb) this.reverb.roomSize = v;
    this.requestUpdate();
  }

  get decayTime() {
    return this.reverb.decayTime;
  }
  set decayTime(v: number) {
    if (this.reverb) this.reverb.decayTime = v;
    this.requestUpdate();
  }

  get fadeInTime() {
    return this.reverb.fadeInTime;
  }
  set fadeInTime(v: number) {
    if (this.reverb) this.reverb.fadeInTime = v;
    this.requestUpdate();
  }

  get dryWet() {
    return this.reverb.dryWet;
  }
  set dryWet(v: number) {
    if (this.reverb) this.reverb.dryWet = v;
    this.requestUpdate();
  }
}


const reverb = mix(Reverb, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  // HasCircleMenuMixin
])


window.customElements.define(SElement.reverb, reverb);
