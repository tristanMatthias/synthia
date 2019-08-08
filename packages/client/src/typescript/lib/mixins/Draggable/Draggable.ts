import { LitElement } from 'lit-element';
import { SElement } from '../../../types';
import { pxToRem } from '../../pxToRem';

export interface InitialPosition {
  x: number | string,
  y: number | string
}
export interface Position {
  x: number,
  y: number
}


export enum DraggableEvents {
  dragged = 'dragged'
}


export const DraggableMixin = (superclass: new () => LitElement) =>
  class Draggable extends superclass {

    private _synth = document.querySelector(SElement.synthPage)!;

    protected _initialPosition?: InitialPosition;
    private _offset: Position = { x: 0, y: 0 };
    private _dragStartPosition: null | Position = null;
    private _dragOffsetPosition: Position = { x: 0, y: 0 };


    set x(x: number) {
      this.style.left = `${x}%`;
    }
    set y(y: number) {
      this.style.top = `${y}%`;
    }


    constructor() {
      super();
      this._dragStart = this._dragStart.bind(this);
      this._dragEnd = this._dragEnd.bind(this);
      this._drag = this._drag.bind(this);

      if (!this._initialPosition) this._initialPosition = { x: 0, y: 0 }

      if (typeof this._initialPosition.x === 'number') {
        this._initialPosition.x = `${this._initialPosition.x / 10}rem`
      }
      if (typeof this._initialPosition.y === 'number') {
        this._initialPosition.y = `${this._initialPosition.y / 10}rem`
      }
    }


    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('mousedown', this._dragStart);
    }

    render() {
      return super.render();
    }

    private updatePosition() {
      const offsetX = this._offset.x + this._dragOffsetPosition.x;
      const offsetY = this._offset.y + this._dragOffsetPosition.y;
      this.style.transform = `translate(calc(${this._initialPosition!.x} + ${
        offsetX / 10
        }rem), calc(${this._initialPosition!.y} + ${
        offsetY / 10
        }rem))`;

      this.requestUpdate();

      this.dispatchEvent(new CustomEvent(DraggableEvents.dragged))

      const canvasBox = document.querySelector(SElement.canvas)!.getBoundingClientRect() as DOMRect;
      const box = this.getBoundingClientRect() as DOMRect;
      // @ts-ignore
      if (this.model) this.model.position = {
        x: (box.x + Math.abs(canvasBox.x)) / canvasBox.width * 100,
        y: (box.y + Math.abs(canvasBox.y)) / canvasBox.height * 100
      }
    }

    private _dragStart(e: MouseEvent) {
      if (this._synth.isConnecting) return;
      e.stopPropagation();

      window.addEventListener('mouseup', this._dragEnd);
      window.addEventListener('mousemove', this._drag);
      this._dragStartPosition = { x: e.clientX, y: e.clientY };
    }

    private _dragEnd(e: MouseEvent) {
      this._synth.isDragging = false;
      this._offset.x += this._dragOffsetPosition.x;
      this._offset.y += this._dragOffsetPosition.y;
      this._dragOffsetPosition = { x: 0, y: 0 };
      window.removeEventListener('mousemove', this._drag);
      window.removeEventListener('mouseup', this._dragEnd);
    }

    private _drag(e: MouseEvent) {
      // TODO: Prevent off screen dragging
      let x = e.clientX - this._dragStartPosition!.x;
      let y = e.clientY - this._dragStartPosition!.y;
      this._dragOffsetPosition = { x, y };

      // Only start drag if moved more than 10 pixels
      if (!this._synth.isDragging) {
        const distanceDragged = Math.sqrt(Math.abs((this._dragOffsetPosition.y ** 2) - (this._dragOffsetPosition.x ** 2)));
        if (distanceDragged > 10) this._synth.isDragging = true;
      }

      this.updatePosition();
    }
  }
