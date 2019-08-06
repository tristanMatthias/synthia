import { html, LitElement } from 'lit-element';

import { DraggableMixin, InitialPosition } from '../../../lib/mixins/Draggable/Draggable';
import { mix } from '../../../lib/mixins/mix';
import { Model } from '../../../lib/Model/Model';
import { SElement } from '../../../types';
import { ElementToFileNodeType } from '../App/createNode';
import styles from './canvas.styles';


export class Canvas extends LitElement {
  model?: Model
  synthId?: string;

  _initialPosition: InitialPosition;

  private _app = document.querySelector(SElement.app)!;

  constructor() {
    super();
    this._handleDrop = this._handleDrop.bind(this);
    this._initialPosition = {x: '-50%', y: '-50%'};
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
    this.addEventListener('mouseup', (e) => {
      // @ts-ignore
      if (!this._app.isDragging && e.target === this) this._app.deselect()
    });
  }

  clear() {
    const nodes = Array.from(this.querySelectorAll('*:not(synthia-root)'));
    nodes.forEach(n => n.remove());
  }

  private _handleDrop(e: DragEvent) {
    if (!this.model || !this.synthId) return false;

    let { x, y } = this.getBoundingClientRect() as DOMRect;
    x = Math.abs(x) + e.clientX - 60;
    y = Math.abs(y) + e.clientY - 60;

    const type = e.dataTransfer!.getData('type')! as keyof typeof ElementToFileNodeType;

    const object = document.createElement(type);
    const model = this.model.createSynthNode(this.synthId, x, y, ElementToFileNodeType[type]);
    // @ts-ignore
    object.model = model;
    object.id = model!.id;

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
