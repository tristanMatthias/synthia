import { LitElement } from 'lit-element';
import { SElement } from '../../../types';



export const DeletableMixin = (superclass: new () => LitElement) =>
  class Deletable extends superclass {

    selected?: boolean;
    private _synth = document.querySelector(SElement.synthPage)!;

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
        e.preventDefault();
        this.remove();
        // Remove the synth node on deleting the component
        this._synth.removeNode(this);
        this._synth.synth.removeNode(this.id);
        window.removeEventListener('keydown', this._deleteableKeyDown);
      }
    }
  }
