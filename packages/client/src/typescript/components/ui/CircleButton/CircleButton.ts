import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './circle-button.styles';

@customElement(SElement.circleButton)
export class CircleButton extends LitElement {
  static get styles() {
    return [styles]
  }

  render() {
    return html`<slot></slot>`;
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.circleButton]: CircleButton;
  }
}
