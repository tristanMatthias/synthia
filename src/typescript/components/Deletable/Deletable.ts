import { LitElement } from 'lit-element';



export const DeletableMixin = (superclass: new () => LitElement) =>
  class Deletable extends superclass {

    selected?: boolean;

    constructor() {
      super();
      this._deleteableKeyDown = this._deleteableKeyDown.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('keydown', this._deleteableKeyDown);
    }


    private _deleteableKeyDown(e: KeyboardEvent) {
      if (e.code === 'Backspace' && this.selected) {
        this.remove();
        window.removeEventListener('keydown', this._deleteableKeyDown);
      }
    }
  }
