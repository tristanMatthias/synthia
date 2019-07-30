import { html } from 'lit-element';

import { iconEffect } from '../../icons/effect';
import { iconEffectReverb } from '../../icons/effectReverb';
import { Storage, StorageKey } from '../../lib/Storage';
import { ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { mix } from '../../mixins/mix';
import { ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../mixins/Selectable/Selectable';
import { ReverbEffect } from '../../Nodes/Reverb';
import { SElement } from '../../types';
import { BaseComponent } from '../BaseComponent/BaseComponent';
import { SidebarEvents } from '../Sidebar/Sidebar';
import styles from './reverb.styles';
import { ReverbSidebar } from './ReverbSidebar/ReverbSidebar';
import { HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { iconConnect } from '../../icons/connect';
import { iconSettings } from '../../icons/settings';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';

export class Reverb extends BaseComponent {

  static get styles() {
    return [styles]
  }

  reverb: ReverbEffect = this._ctx.createReverb();
  multipleConnections = false;
  output = this.reverb;
  input = this.reverb;


  private _sidebar: ReverbSidebar | null = null;
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
    <div class="icon">${iconEffectReverb}</div>`;
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
  HasCircleMenuMixin
])


window.customElements.define(SElement.reverb, reverb);
