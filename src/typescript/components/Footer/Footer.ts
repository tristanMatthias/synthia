import { customElement, html, LitElement, TemplateResult } from 'lit-element';

import { filter } from '../../icons/filter';
import { oscillator2 } from '../../icons/oscillator2';
import { SElement } from '../../types';
import styles from './footer.styles';
import { footerBackground } from '../../images/footerBackground';
import { filterSmall } from '../../icons/filter-small';
import { Filter } from '../Filter/Filter';
import { oscillatorSmall } from '../../icons/oscillatorSmall';
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
      {icon: filterSmall, text: 'Filter', type: SElement.filter},
      {icon: oscillatorSmall, text: 'Oscillator', type: SElement.oscillator}
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
