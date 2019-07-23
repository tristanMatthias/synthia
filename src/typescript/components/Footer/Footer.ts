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
  node: any
}


@customElement(SElement.footer)
export class ComponentToolbar extends LitElement {
  static get styles() {
    return [styles]
  }

  get nodes(): FooterNode[] {
    return [
      {icon: filterSmall, text: 'Filter', node: Filter},
      {icon: oscillatorSmall, text: 'Oscillator', node: Oscillator}
    ]
  }

  render() {
    return html`
      ${footerBackground}
      ${this.nodes.map(n => html`<div>${n.icon}<span>${n.text}</div>`)}
    `;
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.footer]: ComponentToolbar;
  }
}
