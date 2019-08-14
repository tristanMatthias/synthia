import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';

import { iconClose } from '../../../images/icons/close';
import { SElement } from '../../../types';
import styles from './modal.styles';

export interface ModalButton {
  color: string;
  text: string;
  hollow?: boolean;
  loading?: boolean;
  action: () => any;
}

@customElement(SElement.modal)
export class Modal extends LitElement {
  static styles = [styles];

  @property()
  heading: string | TemplateResult | null = null;

  @property({ attribute: true, type: Boolean })
  closeable: boolean = true;

  @property()
  buttons?: ModalButton[];

  protected _modal = document.querySelector(SElement.modalContainer)!

  render() {
    // Default modal content. Could be overridden if this class is extended
    return html`
      ${this._renderHeader()}
      <main>
        <slot></slot>
      </main>
      ${this._renderFooter()}
    `;
  }

  close() {
    this._modal.close();
  }

  protected _renderHeader() {
    return html`<header>
      ${this.heading ? this.heading : html`<slot name="heading"></slot>`}
      ${this.closeable
      ? html`<span @click=${this.close.bind(this)}>
          ${iconClose}
        </span>`
        : null
      }
    </header>`;
  }

  protected _renderFooter() {
    if (!this.buttons || !this.buttons.length) return null;
    return html`<footer>
      ${this.buttons.reverse().map(b => html`<synthia-button
          .hollow=${b.hollow}
          @click=${b.action}
          .color=${b.color}
          .loading=${b.loading}
        > ${b.text} </synthia-button>`)
      }
    </footer>`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.modal]: Modal;
  }
}
