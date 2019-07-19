import { LitElement } from 'lit-element';

export interface InitialPosition {
  x: number | string,
  y: number | string
}
interface Position {
  x: number,
  y: number
}


export const DraggableMixin = (superclass: new () => LitElement) =>
  class Draggable extends superclass {

    context = new AudioContext();

    protected _initialPosition?: InitialPosition;
    private _offset: Position = { x: 0, y: 0 };
    private _dragging = false;
    private _dragStartPosition: null | Position = null;
    private _dragOffsetPosition: Position = { x: 0, y: 0 };


    constructor() {
      super();
      this._dragStart = this._dragStart.bind(this);
      this._dragEnd = this._dragEnd.bind(this);
      this._drag = this._drag.bind(this);

      if (!this._initialPosition) this._initialPosition = { x: 0, y: 0 }

      if (typeof this._initialPosition.x === 'number') {
        this._initialPosition.x = `${this._initialPosition.x}px`
      }
      if (typeof this._initialPosition.y === 'number') {
        this._initialPosition.y = `${this._initialPosition.y}px`
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

      this.style.transform = `translate(calc(${this._initialPosition!.x} + ${
        this._offset.x + this._dragOffsetPosition.x
        }px), calc(${this._initialPosition!.y} + ${
        this._offset.y + this._dragOffsetPosition.y
        }px))`
    }

    private _dragStart(e: MouseEvent) {
      e.stopPropagation();
      this._dragging = true;
      window.addEventListener('mouseup', this._dragEnd);
      window.addEventListener('mousemove', this._drag);
      this._dragStartPosition = { x: e.clientX, y: e.clientY };
    }

    private _dragEnd(e: MouseEvent) {
      this._dragging = true;
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
      this.updatePosition();
    }
  }
