import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './form.styles';
import { proxa } from 'proxa';

@customElement(SElement.form)
export class Form extends LitElement {
  static styles = [styles];

  values = proxa<any>({}, () => this._updateValues())

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._handleChange)
  }

  render() {
    return html`<slot></slot>`;
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.values[target.name] = target.value;
  }

  private _updateValues() {
    (Array.from(this.querySelectorAll('*[name]')) as HTMLInputElement[])
      .forEach((inp) => {
        if (inp.value !== this.values[inp.name]) inp.value = this.values[inp.name];
      })
  }
}
