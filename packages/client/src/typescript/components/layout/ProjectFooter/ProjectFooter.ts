import { customElement, html, LitElement } from "lit-element";
import { SElement } from "../../../types";
import styles from './project-footer.styles';

@customElement(SElement.projectFooter)
export class Page extends LitElement {
  static styles = [styles];

  render() {
    return html`
    `;
  }
}

