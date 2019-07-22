import { html, LitElement, property } from 'lit-element';

import { SElement } from '../../types';
import styles from './circle-menu.styles';


export class CircleMenu extends LitElement {
  static get styles() {
    return [styles]
  }

  @property({reflect: true, type: Boolean})
  open: boolean = false

  @property({reflect: true, type: Number})
  interval: number = 30

  render() {
    const options = [1,2,3, 4, 5, 6, 7, 8];
    return html`${options.map((o, i) => html`
      <div style="transform: translateY(-50%) rotate(${i * this.interval}deg)">
        <span style="transform: rotate(${i * -1 * this.interval}deg); transition-delay: ${i / 2.1 * 100}ms">
          <slot name="button-${i}"></slot>
        </span>
      </div>
    `)}`;
  }

}

window.customElements.define(SElement.circleMenu, CircleMenu);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.circleMenu]: CircleMenu;
  }
}
