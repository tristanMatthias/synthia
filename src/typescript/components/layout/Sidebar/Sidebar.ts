import { LitElement, html, property, customElement, TemplateResult } from "lit-element";
import styles from './sidebar.styles';
import { iconClose } from "../../../images/icons/close";
import { SElement } from "../../../types";

export enum SidebarEvents {
  closed = 'closed'
}

@customElement(SElement.sidebar)
export class Sidebar extends LitElement {
  static styles = [styles]

  @property({reflect: true})
  heading?: string;

  @property({reflect: true})
  type: 'left' | 'right' = 'right';

  protected get _contents(): TemplateResult | null {
    return null;
  }

  render() {
    return html`
      <header>
        <h2> ${this.heading || html`<slot name="heading"></slot>`} </h2>
        <span @click=${this.close.bind(this)}>
          ${iconClose}
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
