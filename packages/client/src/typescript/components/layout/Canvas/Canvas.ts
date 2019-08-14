import { html, LitElement } from 'lit-element';

import { DraggableMixin, InitialPosition } from '../../../lib/mixins/Draggable/Draggable';
import { mix } from '../../../lib/mixins/mix';
import { SElement } from '../../../types';
import { ElementToFileNodeType } from '../../pages/synth/createNode';
import styles from './canvas.styles';
import { model } from '../../../lib/Model/Model';


export class Canvas extends LitElement {

  _initialPosition: InitialPosition;

  private _synth = document.querySelector(SElement.synthPage)!;

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
      if (!this._synth.isDragging && e.target === this) this._synth.deselect()
    });
  }

  clear() {
    const nodes = Array.from(this.querySelectorAll('*:not(synthia-root)'));
    nodes.forEach(n => n.remove());
  }

  private _handleDrop(e: DragEvent) {
    if (!model.file || !this._synth.synthId) return false;

    let { x, y, width, height } = this.getBoundingClientRect() as DOMRect;

    const xPerc = (Math.abs(x) + e.clientX - 60) / width * 100;
    const yPerc = (Math.abs(y) + e.clientY - 60) / height * 100;
    // const yPerc = pxToRem(Math.abs(y) + e.clientY - 60);
    const type = e.dataTransfer!.getData('type')! as keyof typeof ElementToFileNodeType;

    const object = document.createElement(type);
    const oModel = model.createSynthNode(this._synth.synthId, xPerc, yPerc, ElementToFileNodeType[type]!);
    // @ts-ignore
    object.model = oModel;
    object.id = oModel!.id;

    // @ts-ignore
    object.x = xPerc;
    // @ts-ignore
    object.y = yPerc;
    this.appendChild(object);

    return object;
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
