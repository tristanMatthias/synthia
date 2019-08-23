import { LitElement, html, property, customElement, TemplateResult } from "lit-element";
import styles from './sidebar.styles';

import { SElement } from "../../../types";

export enum SidebarEvents {
  closed = 'closed'
}

export enum SidebarSide { left = 'left', right = 'right' }

@customElement(SElement.sidebar)
export class Sidebar extends LitElement {
  static styles = [styles]

  @property({reflect: true})
  heading?: string;

  @property({reflect: true, type: String})
  type: SidebarSide = SidebarSide.right;

  protected get _contents(): TemplateResult | null {
    return null;
  }

  render() {
    return html`
      <header>
        <h2> ${this.heading || html`<slot name="heading"></slot>`} </h2>
        <span @click=${this.close.bind(this)}>
          <s-icon type="close"></s-icon>
        </span>
      </header>
      <main>
        ${this._contents || html`<slot></slot>`}
      </main>
    `;
  }

  close() {
    this.dispatchEvent(new CustomEvent(SidebarEvents.closed, {
      bubbles: true,
      composed: true
    }));
    this.remove();
  }
}
