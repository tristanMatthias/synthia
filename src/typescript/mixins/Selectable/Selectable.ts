import { html, LitElement, property } from 'lit-element';

import styles from './selectable.styles';
import { SElement } from '../../types';


export interface Selectable {
  selected: boolean;
}


export const SelectableMixin = (superclass: new () => LitElement) =>
  class Selectable extends superclass implements Selectable {
    static get styles() {
      // @ts-ignore
      return [styles, superclass.styles]
    }

    private _app = document.querySelector(SElement.app)!;

    constructor() {
      super();
      this._selectableClick = this._selectableClick.bind(this);
      this._selectableKeyDown = this._selectableKeyDown.bind(this);
      this._selectableMouseDown = this._selectableMouseDown.bind(this);
    }


    private _selected: boolean = false;
    get selected(): boolean {
      return this._selected;
    }
    set selected(v: boolean) {
      this._selected = v;
      this.toggleAttribute('selected', v);
      this.requestUpdate();
    }

    render() {
      const selected = html`<div class="selected ${this.selected ? 'on' : ''}">
        <span></span><span></span><span></span><span></span>
      </div>`;

      return html`${selected} ${super.render()}`;
    }


    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('click', this._selectableClick);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('click', this._selectableClick);
      this.removeEventListener('keydown', this._selectableKeyDown);
      this._app.deselect(this);
    }

    private _selectableClick(e: MouseEvent) {
      if (e.shiftKey) {
        console.log(this.selected);

        if (this.selected) this._app.deselect(this);
        else this._app.select(this, true);
      } else this._app.select(this);

      window.addEventListener('keydown', this._selectableKeyDown);
      window.addEventListener('mousedown', this._selectableMouseDown);
    }

    private _selectableKeyDown(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        this.selected = false;
        window.removeEventListener('keydown', this._selectableKeyDown);
      }
    }

    private _selectableMouseDown(e: MouseEvent) {
      if (e.target !== this) {
        this.selected = false;
        window.removeEventListener('mousedown', this._selectableMouseDown);
      }
    }
  }
