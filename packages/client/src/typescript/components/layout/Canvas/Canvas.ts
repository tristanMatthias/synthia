import { html, LitElement } from 'lit-element';

import { DraggableMixin, InitialPosition } from '../../../lib/mixins/Draggable/Draggable';
import { mix } from '../../../lib/mixins/mix';
import { SElement } from '../../../types';
import { ElementToFileNodeType, createComponentNode } from '../../pages/project/synth/createComponentNode';
import styles from './canvas.styles';
import { project } from '../../../lib/Project/Project';


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
    if (!project.file || !this._synth.synthId) return false;

    let { x, y, width, height } = this.getBoundingClientRect() as DOMRect;

    const xPerc = (Math.abs(x) + e.clientX - 60) / width * 100;
    const yPerc = (Math.abs(y) + e.clientY - 60) / height * 100;
    const type = e.dataTransfer!.getData('type')! as keyof typeof ElementToFileNodeType;

    const {synthNode, audioNode} = this._synth.synth.createNode(
      xPerc, yPerc,
      ElementToFileNodeType[type]!
    );

    return this.appendChild(createComponentNode(synthNode, audioNode));
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
