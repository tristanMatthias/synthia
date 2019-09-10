import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import { Toaster } from '../../ui/Toaster/Toaster';
import styles from './side-menu.styles';


interface SideMenuItemBase {
  icon: string,
  text: string
}

interface SideMenuItemNode extends SideMenuItemBase {
  type: SElement
}

interface SideMenuItemButton extends SideMenuItemBase {
  action: () => void;
}

@customElement(SElement.sideMenu)
export class SideMenu extends LitElement {
  static get styles() {
    return [styles]
  }

  private _toaster: Toaster;
  private _lastNotified = Date.now();

  constructor() {
    super();
    this._handleDragStart = this._handleDragStart.bind(this);
    this._instruct = this._instruct.bind(this);
  }


  get buttons(): SideMenuItemButton[] {
    return [
      // {icon: iconWaveSine, text: 'LFO Settings', action: () => alert(1)}
    ]
  }

  get nodes(): SideMenuItemNode[] {
    return [
      { icon: 'waveSmall', text: 'Wave', type: SElement.wave },
      { icon: 'filterSmall', text: 'Filter', type: SElement.filter },
      { icon: 'effectDelay', text: 'Delay effect', type: SElement.delay },
      { icon: 'effectReverb', text: 'Reverb effect', type: SElement.reverb },
      { icon: 'effectPan', text: 'Pan effect', type: SElement.pan }
    ]
  }


  connectedCallback() {
    super.connectedCallback();
    this._toaster = document.querySelector(SElement.toaster)!;
  }

  render() {
    return html`
      ${this.buttons.map(n => html`<div class="button">
        <div @click=${n.action}>
          <s-icon type=${n.icon}></s-icon>
        </div>
        <span>${n.text}</span>
      </div>`)}

      ${this.nodes.map((n, i) => html`<div class="drag">
        <div
          draggable="true"
          @click=${this._instruct}
          @dragstart=${this._handleDragStart(n.type)}
          style="animation-delay: ${i * 80}ms"
        ><s-icon type=${n.icon}></s-icon>
        <span>${n.text}</span>
      </div>`
    )}
    </div>`;
  }

  private _handleDragStart(type: string) {
    return (e: DragEvent) => {
      e.dataTransfer!.setData('type', type);
    }
  }

  private _instruct() {
    if ((Date.now() - this._lastNotified) / 1000 > 3) {
      this._toaster.info('Try dragging the items onto the canvas instead');
      this._lastNotified = Date.now();
    }
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.sideMenu]: SideMenu;
  }
}
