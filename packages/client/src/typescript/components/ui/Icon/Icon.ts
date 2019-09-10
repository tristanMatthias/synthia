import { LitElement, property, html, css, customElement } from "lit-element";
import * as icons from '../../../images/icons';
import { SElement } from "../../../types";

@customElement(SElement.icon)
export class Icon extends LitElement {
  static styles = [
    css`
      :host {
        display: inline-block;
        width: 4rem;
        height: 4rem;
        vertical-align: middle;
        --color: var(--color-main);
      }
      :host([type="close"]) {
        --stroke-width: 0.2rem;
      }
      :host svg {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      :host svg * {
        stroke-width: var(--stroke-width, 0.4rem);
        /* stroke: var(--stroke, --color); */
      }
    `
  ]

  @property({reflect: true})
  type: keyof typeof icons;


  render() {
    const i = icons[this.type];
    if (!i) {
      console.error(`No icon ${this.type}`);
      return html``;
    }
    return i;
  }
}
