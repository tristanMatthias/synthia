import { html, TemplateResult } from 'lit-element';

import { iconConnect } from '../../../images/icons/connect';
import { iconEffect } from '../../../images/icons/effect';
import { iconSettings } from '../../../images/icons/settings';
import { ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { Storage, StorageKey } from '../../../lib/Storage';
import { Sidebar, SidebarEvents } from '../../layout/Sidebar/Sidebar';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { BaseNode } from '../BaseNode/BaseNode';
import styles from './base-effect.styles';


export interface NodeSidebar extends Sidebar {
  input?: any;
}


export class BaseEffectClass<SidebarType extends NodeSidebar> extends BaseNode {

  static get styles() {
    return [styles]
  }

  protected _icon: TemplateResult = html``;
  protected _sidebarType: string = 'synthia-sidebar';
  protected _canvas: boolean = false;

  private _sidebar: SidebarType | null = null;
  private _startConnect() { return true; }


  get buttons(): CircleMenuButton[] {
    return [
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
      { text: 'Settings', icon: iconSettings, action: () => this.toggleSidebar(), color: 'text' }
    ];
  }


  render() {
    return html`
      ${this._canvas ? html`<canvas></canvas>`: null}
      <div class="background">${iconEffect}</div>
      <div class="icon">${this._icon}</div>
    `;
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
      const sidebar = document.createElement(this._sidebarType) as SidebarType;
      sidebar.input = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;

      if (!Storage.get(StorageKey.notifiedSidebarOpen)) {
        this._toaster.info('Pro tip: You can open any settings by double clicking on the node');
        Storage.set(StorageKey.notifiedSidebarOpen, true)
      }
    }
  }
}

export const baseEffectMix = (c: any) => mix(c, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  HasCircleMenuMixin
]);