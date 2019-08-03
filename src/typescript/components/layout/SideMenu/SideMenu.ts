import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { iconEffectDelay } from '../../../images/icons/effectDelay';
import { iconEffectReverb } from '../../../images/icons/effectReverb';
import { iconFilterSmall } from '../../../images/icons/filterSmall';
import { iconWaveSmall } from '../../../images/icons/waveSmall';
import { SElement } from '../../../types';
import styles from './side-menu.styles';
import { iconEffectPan } from '../../../images/icons/effectPan';
import { iconWaveSine } from '../../../images/icons/waveSine';


interface SideMenuItemBase {
  icon: TemplateResult,
  text: string
}

interface SideMenuItemNode extends SideMenuItemBase {
  type: SElement
}

interface SideMenuItemButton extends SideMenuItemBase {
  action: () => void;
}

type SideMenuNode = SideMenuItemNode | SideMenuItemButton;


@customElement(SElement.sideMenu)
export class SideMenu extends LitElement {
  static get styles() {
    return [styles]
  }

  private _toaster = document.querySelector(SElement.toaster)!;
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
      {icon: iconWaveSmall, text: 'Wave', type: SElement.wave},
      {icon: iconFilterSmall, text: 'Filter', type: SElement.filter},
      {icon: iconEffectDelay, text: 'Delay effect', type: SElement.delay},
      {icon: iconEffectReverb, text: 'Reverb effect', type: SElement.reverb},
      {icon: iconEffectPan, text: 'Pan effect', type: SElement.pan}
    ]
  }


  render() {
    return html`
      ${this.buttons.map(n => html`<div class="button">
        <div @click=${n.action}>${n.icon}</div>
        <span>${n.text}</span>
      </div>`)}

      ${this.nodes.map(n => html`<div class="drag">
            <div
              draggable="true"
              @click=${this._instruct}
              @dragstart=${this._handleDragStart(n.type)}
            >${n.icon}</div>
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
