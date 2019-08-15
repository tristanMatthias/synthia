import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './card.styles';

@customElement(SElement.card)
export class Card extends LitElement {
  static styles = [styles];

  render() {
    return html`
      <slot></slot>
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.card]: Card;
  }
}
