import { customElement, html, LitElement, property } from 'lit-element';

import { SElement } from '../../../types';
import styles from './button.styles';
import { TooltipPosition } from '../Tooltip/Tooltip';

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
  icon: string | null = null;

  @property()
  tooltip: string | null = null;

  @property()
  tooltipPosition: TooltipPosition | null = 'top';

  render() {
    let content;
    if (this.icon) content = html`<s-icon type=${this.icon}></s-icon>`;
    else content = html`
      <span><slot></slot></span>
      ${this.loading ? html`<s-loading></s-loading>` : null}`;

    return html`
      ${content}
      ${this.tooltip
        ? html`<s-tooltip .for=${this} position=${this.tooltipPosition}>${
          this.tooltip
        }</s-tooltip>`
        : null
      }
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
