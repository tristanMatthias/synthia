import { html, LitElement } from 'lit-element';

import { SElement } from '../../types';
import { DraggableMixin, InitialPosition } from '../Draggable/Draggable';
import styles from './canvas.styles';


export class Canvas extends LitElement {

  _initialPosition: InitialPosition;

  constructor() {
    super();
    console.log('after');

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

let root = DraggableMixin(Canvas);

window.customElements.define(SElement.canvas, root);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.canvas]: Canvas;
  }
}
