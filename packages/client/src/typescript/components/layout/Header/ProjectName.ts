import {LitElement, property, html, customElement, query, css} from 'lit-element';
import { Input } from '../../ui/Input/Input';
import { model } from '../../../lib/Model/Model';

@customElement('project-name')
export class ProjectName extends LitElement {
  static styles = [
    css`
      :host,
      :host synthia-input {
        display: block;
        font-size: 1.8rem;
        line-height: 2rem;
        height: 2rem;
        font-weight: 600;
        letter-spacing: 0.1rem;
        color: var(--color-white);
        --input-padding: 0.5rem;
        --input-height: 2.5rem;
        --input-font-size: 1.4rem;
      }

      :host span {
        position: relative;
        cursor: pointer;
      }

      :host span:before {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        bottom: -0.4rem;
        border-bottom: 0.2rem dashed var(--color-line);
        opacity: 0;
        transition: all 0.1s;
      }

      :host(:hover) span:before {
        opacity: 1;
      }
    `
  ]

  @property()
  value: string;

  @property()
  editing = false;

  @query('synthia-input')
  private _input: Input;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick)
  }

  render() {
    if (this.editing) {
      return html`<synthia-input .value=${this.value}></synthia-input>`;
    }
    return html`<span>${this.value}</span>`;
  }

  private async _handleClick() {
    if (this.editing) return;

    this.editing = true;
    await this.updateComplete;
    this._input.focus();

    this._input!.addEventListener('blur', () => this._update());
    this._input!.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') this._update();
    });
  }

  private _update() {
    if (!this.editing) return;

    if (this._input.value && this._input.value !== this.value) {
      this.value = this._input!.value!;
      model.file!.name = this.value;
      model.save();
    }
    this.editing = false;
  }
}