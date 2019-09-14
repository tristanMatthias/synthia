import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import styles from './modal-container.styles'
import { SElement } from '../../../types';

export enum ModalContainerEvents {
  open = 'open',
  close = 'close'
}

@customElement(SElement.modalContainer)
export class ModalContainer extends LitElement {

  static styles = [styles];

  @property({ attribute: true, type: Boolean, reflect: true })
  show: boolean = false;

  @property()
  private _modalTag: string | null = null;

  private get _modal(): null | TemplateResult {
    if (!this._modalTag) return null;
    return html`${unsafeHTML(`<${this._modalTag}></${this._modalTag}>`)}`;
  }

  private get _modalElement() {
    if (!this._modalTag) return null;
    return this.shadowRoot!.querySelector(this._modalTag);
  }

  connectedCallback() {
    super.connectedCallback();

    // Enforce element is directly under the body. This is for CSS stacking purposes
    if (this.parentElement !== document.body) {
      document.body.appendChild(this);
    }
  }

  render() {
    if (!this.show) return html``;
    return html`
      <div class="back" @click=${this.close}></div>
      ${this._modal
        ? this._modal
        : html`<slot></slot>`
      }
    `;
  }

  /**
   * Open a custom modal
   * @param modal HTML tag of custom modal
   */
  open(modal: string) {
    this._modalTag = modal;
    this.show = true;
    this.dispatchEvent(new CustomEvent(ModalContainerEvents.open));
  }

  close() {
    if (!this.show) return;


    if (this._modalTag) {
      const modal = this.shadowRoot!.querySelector(this._modalTag)!;
      modal.classList.add('animation-exit');
      modal.remove();
      this._modalTag = null;
    }

    this.show = false;
    this.dispatchEvent(new CustomEvent(ModalContainerEvents.close));

  }


  /**
   * Wait for the open modal to trigger an event, and return the detail
   * @param eventName Name of event to wait for (default: 'answer')
   */
  async waitFor<T>(eventName: string = 'answer'): Promise<T | false> {
    await this.updateComplete;

    return new Promise((res) => {
      if (!this._modalTag) {
        res(false);
        this.close();
        return;
      }
      const modal = this._modalElement;

      if (!modal) {
        res(false);
        this.close();
        return;
      }

      // Wait for modal to return the event name, then resolve with the detail
      const handler = (e: CustomEventInit) => {
        res(e.detail);
        modal.removeEventListener(eventName, handler);
        this.close();
      };
      modal.addEventListener(eventName, handler);
    });
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.modalContainer]: ModalContainer;
  }
}
