import { html } from 'lit-element';

import { iconEffect } from '../../icons/effect';
import { iconEffectDelay } from '../../icons/effectDelay';
import { Storage, StorageKey } from '../../lib/Storage';
import { ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { mix } from '../../mixins/mix';
import { ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { BaseComponent } from '../BaseComponent/BaseComponent';
import { SidebarEvents } from '../Sidebar/Sidebar';
import styles from './delay.styles';
import { DelaySidebar } from './DelaySidebar/DelaySidebar';
import { SynthiaDelay } from '../../Nodes/Delay';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { iconConnect } from '../../icons/connect';
import { iconSettings } from '../../icons/settings';
import { HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';

export class Delay extends BaseComponent {

  static get styles() {
    return [styles]
  }

  delay: SynthiaDelay = new SynthiaDelay(this._ctx);
  multipleConnections = false;
  output = this.delay;
  input = this.delay;


  private _sidebar: DelaySidebar | null = null;
  private _startConnect() { return true; }

  get buttons(): CircleMenuButton[] {
    return [
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
      { text: 'Settings', icon: iconSettings, action: () => this.toggleSidebar(), color: 'text' }
    ];
  }


  render() {
    return html`
    <div class="background">${iconEffect}</div>
    <div class="icon">${iconEffectDelay}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
  }


  toggleSidebar(forceRemove?: boolean) {
    if (this._sidebar || forceRemove) {
      if (this._sidebar) this._sidebar.remove();
      this._sidebar = null;
    } else {
      const sidebar = new DelaySidebar();
      sidebar.delay = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;

      if (!Storage.get(StorageKey.notifiedFilterSidebar)) {
        this._toaster.info('Pro tip: You can open the Filter settings by double clicking on the delay');
        Storage.set(StorageKey.notifiedFilterSidebar, true)
      }
    }
  }


  get delayTime() {
    return this.delay.delayTime.value;
  }
  set delayTime(v: number) {
    if (this.delay) this.delay.delayTime.setValueAtTime(v, this._ctx.currentTime);
    this.requestUpdate();
  }

  get feedback() {
    return this.delay.feedback.value;
  }
  set feedback(v: number) {
    if (this.delay) this.delay.feedback.setValueAtTime(v, this._ctx.currentTime);
    this.requestUpdate();
  }
}


const delay = mix(Delay, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  HasCircleMenuMixin
])


window.customElements.define(SElement.delay, delay);
