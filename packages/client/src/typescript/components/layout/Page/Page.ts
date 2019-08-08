import { LitElement, html, customElement, property } from "lit-element";
import { SElement } from "../../../types";
import styles from './page.styles';

@customElement(SElement.page)
export class Page extends LitElement {
  static styles = [styles];

  @property()
  pageTitle = 'Synthia';

  updated(props: Map<keyof Page, any>) {
    super.updated(props);
    window.document.title = this.pageTitle;
  }

  render() {
    return html`<div class="center"><slot></slot></div>`;
  }
}
