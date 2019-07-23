import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { iconFilter } from '../../icons/filter';
import { iconOscillator } from '../../icons/oscillator';
import { SElement } from '../../types';
import styles from './footer.styles';
import { footerBackground } from '../../images/footerBackground';
import { iconFilterSmall } from '../../icons/filterSmall';
import { Filter } from '../Filter/Filter';
import { iconOscillatorSmall } from '../../icons/oscillatorSmall';
import { Oscillator } from '../Oscillator/Oscillator';


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

  constructor() {
    super();
    this._handleDragStart = this._handleDragStart.bind(this);
  }

  get nodes(): FooterNode[] {
    return [
      {icon: iconFilterSmall, text: 'Filter', type: SElement.filter},
      {icon: iconOscillatorSmall, text: 'Oscillator', type: SElement.oscillator}
    ]
  }

  render() {
    return html`
      ${footerBackground}
      ${this.nodes.map(n => html`<div>
        <div draggable="true" @dragstart=${this._handleDragStart(n.type)}>${n.icon}</div>
        <span>${n.text}
      </div>`)}
    `;
  }

  _handleDragStart(type: string) {
    return (e: DragEvent) => {
      e.dataTransfer!.setData('type', type);
    }
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.footer]: ComponentToolbar;
  }
}
