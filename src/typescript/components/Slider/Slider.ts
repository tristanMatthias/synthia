import { customElement, LitElement, property, html } from 'lit-element';

import { SElement } from '../../types';
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

  @property()
  value: number = 50;

  private _active: boolean = false;

  constructor() {
    super();
    this._update = this._update.bind(this);
    this._handleMove = this._handleMove.bind(this);
  }

  render() {
    const left = `${(this.value / (this.max)) * 100}%`;
    return html`<span class="slide" style="left: ${left}"></span>`;
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
    const relative = e.clientX - box.left;
    let value = (relative / box.width) * this.max;
    if (value > this.max) value = this.max;
    if (value < 0) value = 0;
    this.value = value;
  }

  updated(props: Map<keyof Slider, any>) {
    super.updated(props);
    if (props.has('value')) this.dispatchEvent(new CustomEvent('change', {
      detail: this.value
    }))
  }
}



declare global {
  interface HTMLElementTagNameMap {
    [SElement.slider]: Slider;
  }
}
