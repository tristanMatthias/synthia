import { html, LitElement } from 'lit-element';

import { SElement } from '../../types';
import { DraggableMixin, InitialPosition } from '../../mixins/Draggable/Draggable';
import styles from './canvas.styles';
import { mix } from '../../mixins/mix';


export class Canvas extends LitElement {

  _initialPosition: InitialPosition;

  constructor() {
    super();
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
