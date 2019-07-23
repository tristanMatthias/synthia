import { html, LitElement } from 'lit-element';

import { SElement } from '../../types';
import { DraggableMixin, InitialPosition } from '../../mixins/Draggable/Draggable';
import styles from './canvas.styles';
import { mix } from '../../mixins/mix';


export class Canvas extends LitElement {

  _initialPosition: InitialPosition;

  constructor() {
    super();
    this._handleDrop = this._handleDrop.bind(this);
    this._initialPosition = {x: '-50%', y: '-50%'}
  }

  static get styles() {
    return [styles]
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('drop', this._handleDrop);
    this.addEventListener('dragover', (e) => e.preventDefault());
  }

  private _handleDrop(e: DragEvent) {
    let { x, y } = this.getBoundingClientRect() as DOMRect;
    x = Math.abs(x) + e.clientX - 60;
    y = Math.abs(y) + e.clientY - 60;

    const type = e.dataTransfer!.getData('type')!;
    const object = document.createElement(type);

    // @ts-ignore
    object.x = x;
    // @ts-ignore
    object.y = y;
    this.appendChild(object);
  }
}

window.customElements.define(
  SElement. canvas,
  mix(Canvas, [
    DraggableMixin
  ])
);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.canvas]: Canvas;
  }
}
