import { customElement, html, LitElement, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { SElement } from '../../../types';
import styles from './input.styles';

@customElement(SElement.input)
export class ZenInput extends LitElement {
  static styles = [styles];

  @property({ reflect: true, type: String })
  public placeholder?: string | null;

  @property({ reflect: true, type: String })
  public name?: string | null;

  @property({ reflect: true })
  public type?: string;

  @property({ reflect: true, type: String })
  public icon?: string;

  @property({ reflect: true, type: Boolean })
  public loading?: boolean;

  @property()
  public value: string | null = null;
  @property({ reflect: true, type: Boolean })
  public disabled?: boolean;

  constructor() {
    super();
    this._handleInput = this._handleInput.bind(this);
  }

  public render() {
    const { loading, type, placeholder, disabled, value } = this;

    const v = value || '';

    // ${icon && html`<zen-icon type="${icon}" .color="grey-300"></zen-icon>`}
    return html`

      <input
        .value="${v}"
        .type="${type}"
        placeholder="${ifDefined(placeholder)}"
        .disabled="${disabled}"
        @input="${this._handleInput}"
      />

      ${loading && html`<synthia-loading></synthia-loading>` }
    `;
  }

  public focus() {
    this.shadowRoot!.querySelector('input')!.focus();
  }

  private _handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      cancelable: true
    }));
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.input]: ZenInput;
  }
}
