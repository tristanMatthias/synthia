import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../types';
import styles from './button.styles';

@customElement(SElement.button)
export class Button extends LitElement {
  static get styles() {
    return [styles]
  }

  render() {
    return html`<slot></slot>`;
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.button]: Button;
  }
}
