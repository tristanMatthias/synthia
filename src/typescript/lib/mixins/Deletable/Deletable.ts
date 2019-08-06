import { LitElement } from 'lit-element';
import { SElement } from '../../../types';



export const DeletableMixin = (superclass: new () => LitElement) =>
  class Deletable extends superclass {

    selected?: boolean;
    private _app = document.querySelector(SElement.app)!;

    constructor() {
      super();
      this._deleteableKeyDown = this._deleteableKeyDown.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('keydown', this._deleteableKeyDown);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // Remove the synth node on deleting the component
      const synth = this._app.model.file.resources.synths.find(s => s.id === this._app.synthId)!;
      synth.nodes = synth.nodes.filter(n => n.id === this.id);
    }


    private _deleteableKeyDown(e: KeyboardEvent) {
      if (e.code === 'Backspace' && this.selected) {
        e.preventDefault();
        this.remove();
        window.removeEventListener('keydown', this._deleteableKeyDown);
      }
    }
  }
