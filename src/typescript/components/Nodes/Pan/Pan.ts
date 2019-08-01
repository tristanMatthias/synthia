import { html } from 'lit-element';

import { iconConnect } from '../../../images/icons/connect';
import { iconEffect } from '../../../images/icons/effect';
import { iconEffectPan } from '../../../images/icons/effectPan';
import { iconSettings } from '../../../images/icons/settings';
import { Storage, StorageKey } from '../../../lib/Storage';
import { ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { SElement } from '../../../types';
import { BaseNode } from '../BaseNode/BaseNode';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import styles from './pan.styles';
import { PanSidebar } from './PanSidebar/PanSidebar';

export class Pan extends BaseNode {

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
