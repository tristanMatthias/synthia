import { html } from 'lit-element';

import { iconConnect } from '../../icons/connect';
import { iconEffect } from '../../icons/effect';
import { iconEffectPan } from '../../icons/effectPan';
import { iconSettings } from '../../icons/settings';
import { Storage, StorageKey } from '../../lib/Storage';
import { ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { BaseComponent } from '../BaseComponent/BaseComponent';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { SidebarEvents } from '../Sidebar/Sidebar';
import styles from './pan.styles';
import { PanSidebar } from './PanSidebar/PanSidebar';

export class Pan extends BaseComponent {

  static get styles() {
    return [styles]
  }

  panner = this._ctx.createStereoPanner();
  multipleConnections = false;
  output = this.panner;
  input = this.panner;


  private _sidebar: PanSidebar | null = null;
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
    <div class="icon">${iconEffectPan}</div>`;
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
      const sidebar = new PanSidebar();
      sidebar.pan = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;

      if (!Storage.get(StorageKey.notifiedFilterSidebar)) {
        this._toaster.info('Pro tip: You can open the Filter settings by double clicking on the panner');
        Storage.set(StorageKey.notifiedFilterSidebar, true)
      }
    }
  }


  get pan() {
    return this.panner.pan.value;
  }
  set pan(v: number) {
    this.panner.pan.value = v;
    this.requestUpdate();
  }
}


const panner = mix(Pan, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  HasCircleMenuMixin
])


window.customElements.define(SElement.pan, panner);
