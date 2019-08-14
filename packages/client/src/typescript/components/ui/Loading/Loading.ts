import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './loading.styles';

@customElement(SElement.loading)
export class Loading extends LitElement {
  static styles = [styles];

  render() {
    return html`<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 150 44">
      <path fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-width="6" d="M-3 22C10.697-2.69 23.443-2.69 35.238 22c11.794 24.69 24.54 24.69 38.237 0 13.697-24.69 26.443-24.69 38.238 0 11.794 24.69 24.54 24.69 38.237 0 13.697-24.69 26.443-24.69 38.238 0 11.794 24.69 24.54 24.69 38.237 0 13.697-24.69 26.443-24.69 38.238 0 11.794 24.69 24.54 24.69 38.237 0"/>
    </svg>`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.loading]: Loading;
  }
}
