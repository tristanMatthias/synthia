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

  @property({reflect: true, type: Boolean})
  loading = false;

  @property({reflect: true, type: Boolean})
  small = false;

  @property({reflect: true, type: String})
  color = 'alt';

  @property({reflect: true, type: String})
  icon = false;

  render() {
    if (this.icon) return html`<s-icon type=${this.icon}></s-icon>`;
    return html`
      <span><slot></slot></span>
      ${this.loading ? html`<s-loading></s-loading>` : null}
    `;
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
