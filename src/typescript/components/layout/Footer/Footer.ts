import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { iconEffectDelay } from '../../../images/icons/effectDelay';
import { iconEffectReverb } from '../../../images/icons/effectReverb';
import { iconFilterSmall } from '../../../images/icons/filterSmall';
import { iconWaveSmall } from '../../../images/icons/waveSmall';
import { footerBackground } from '../../../images/footerBackground';
import { SElement } from '../../../types';
import styles from './footer.styles';
import { iconEffectPan } from '../../../images/icons/effectPan';


interface FooterNode {
  icon: TemplateResult,
  text: string,
  type: SElement
}


@customElement(SElement.footer)
export class ComponentToolbar extends LitElement {
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

  get nodes(): FooterNode[] {
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
      ${footerBackground}
      ${this.nodes.map(n => html`<div>
        <div
          draggable="true"
          @click=${this._instruct}
          @dragstart=${this._handleDragStart(n.type)}
        >${n.icon}</div>
        <span>${n.text}
      </div>`)}
    `;
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
    [SElement.footer]: ComponentToolbar;
  }
}
