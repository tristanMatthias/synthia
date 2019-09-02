import { customElement, LitElement, property, html } from 'lit-element';

import { SElement } from '../../../types';
import styles from './slider.styles';


@customElement(SElement.slider)
export class Slider extends LitElement {
  static get styles() {
    return [styles]
  }

  @property({reflect: true, type: Number})
  min: number = 0;

  @property({reflect: true, type: Number})
  max: number = 100;

  @property({type: Number})
  value?: number;

  @property({type: Boolean, reflect: true})
  vertical: boolean = false;

  @property({type: Boolean, reflect: true})
  handle: boolean = false;

  @property()
  protected _showValue: number = (this.value || this.min) / this.max;

  private _active: boolean = false;

  constructor() {
    super();
    this._update = this._update.bind(this);
    this._handleMove = this._handleMove.bind(this);
  }

  render() {
    const v = this.value === undefined ? this.min : this.value;
    const pos = `${(v - this.min) / (this.max - this.min) * 100}%`;
    const prop = this.vertical ? 'bottom' : 'left';
    return html`<span class="slide" style="${prop}: ${pos}"></span>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._update);
    this.addEventListener('mousedown', () => this._active = true);
    this.addEventListener('mouseup', () => this._active = false);
    this.addEventListener('mouseout', () => this._active = false);
    this.addEventListener('mousemove', this._handleMove);
  }

  _handleMove(e: MouseEvent) {
    if (this._active) this._update(e);
  }

  protected _update(e: MouseEvent) {
    const box = this.getBoundingClientRect();

    let value = this.vertical
      ? (box.bottom - e.clientY) / box.height
      : (e.clientX - box.left) / box.width;

    if (value > 1) value = 1;
    if (value < 0) value = 0;
    this.value = this.min + ((this.max - this.min) * value);
  }

  updated(props: Map<keyof Slider, any>) {
    super.updated(props);
    if (props.has('value')) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: this.value,
        composed: true,
        bubbles: true
      }));
    }
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.slider]: Slider;
  }
}
