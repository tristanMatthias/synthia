import { customElement, html, LitElement, property } from 'lit-element';

import { SElement } from '../../../types';
import styles from './button.styles';

@customElement(SElement.button)
export class Button extends LitElement {
  static styles = [styles];

  @property({reflect: true, type: Boolean})
  disabled = false;

  @property({reflect: true, type: Boolean})
  hollow = false;

  @property({reflect: true, type: String})
  color = 'alt';

  render() {
    return html`<slot></slot>`;
  }

  updated(props: Map<keyof Button, any>) {
    super.updated(props);
    this.style.setProperty('--button-color', `var(--color-${this.color})`);
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.button]: Button;
  }
}
