import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './home.styles';

@customElement(SElement.homePage)
export class PageProjectHome extends LitElement {
  static styles = [styles];

  render() {
    return html`<s-project-list></s-project-list>`;
  }

}
