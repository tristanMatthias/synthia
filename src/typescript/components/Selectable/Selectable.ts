import { html, LitElement, property } from 'lit-element';

import styles from './selectable.styles';


export const SelectableMixin = (superclass: new () => LitElement) =>
  class Selectable extends superclass {
    static get styles() {
      // @ts-ignore
      return [styles, superclass.styles]
    }

    constructor() {
      super();
      this._selectableClick = this._selectableClick.bind(this);
      this._selectableKeyDown = this._selectableKeyDown.bind(this);
      this._selectableMouseDown = this._selectableMouseDown.bind(this);
    }


    private _selected: Boolean = false;
    private get selected(): Boolean {
      return this._selected;
    }
    private set selected(v: Boolean) {
      this._selected = v;
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
    }

    private _selectableClick(e: MouseEvent) {
      this.selected = true;
      window.addEventListener('keydown', this._selectableKeyDown);
      window.addEventListener('mousedown', this._selectableMouseDown);
      e.stopPropagation();
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
