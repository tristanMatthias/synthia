import { html, LitElement, property, TemplateResult } from 'lit-element';

import { SElement } from '../../types';
import styles from './circle-menu.styles';


export interface CircleMenuButton {
  icon: TemplateResult,
  action(e: MouseEvent): void,
  text?: string
}

export class CircleMenu extends LitElement {
  static get styles() {
    return [styles]
  }

  @property()
  buttons: CircleMenuButton[] = []

  @property({ reflect: true, type: Boolean })
  open: boolean = false

  @property({ reflect: true, type: Number })
  interval: number = 30

  @property()
  private _label: string | null = null;

  render() {
    const buttons = this.buttons!.map(({ icon, action, text }, i) =>
      html`
        <div style="transform: translateY(-50%) rotate(${i * this.interval}deg)">
          <span style="transform: rotate(${i * -1 * this.interval}deg); transition-delay: ${i / 2.1 * 100}ms">
            <synthia-button
              @click=${action}
              @mouseover=${() => this._label = text || null}
              @mouseout=${() => this._label = null}
            >${icon}</synthia-button>
          </span>
        </div>`
    );

    return html`${this._label
      ? html`<span class="label">${this._label}</span>`
      : null
    }${buttons}`;

    // return html`${options.map((o, i) => html`
    //   <div style="transform: translateY(-50%) rotate(${i * this.interval}deg)">
    //     <span style="transform: rotate(${i * -1 * this.interval}deg); transition-delay: ${i / 2.1 * 100}ms">
    //       <slot name="button-${i}"></slot>
    //     </span>
    //   </div>
    // `)}`;
  }

}

window.customElements.define(SElement.circleMenu, CircleMenu);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.circleMenu]: CircleMenu;
  }
}
