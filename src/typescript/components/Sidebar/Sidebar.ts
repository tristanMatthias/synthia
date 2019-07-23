import { LitElement, html, property, customElement } from "lit-element";
import styles from './sidebar.styles';
import { iconClose } from "../../icons/close";
import { SElement } from "../../types";

export enum SidebarEvents {
  closed = 'closed'
}

@customElement(SElement.sidebar)
export class Sidebar extends LitElement {
  static styles = [styles]

  @property({reflect: true})
  type: 'left' | 'right' = 'right';

  render() {
    return html`
      <header>
        <h2> <slot name="header"></slot> </h2>
        <span @click=${this.close.bind(this)}>
          ${iconClose}
        </span>
      </header>
      <main>
        <slot></slot>
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
