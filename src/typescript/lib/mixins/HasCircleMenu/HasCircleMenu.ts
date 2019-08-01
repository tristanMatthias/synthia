import { html, LitElement } from 'lit-element';

import { CircleMenuButton } from '../../../components/ui/CircleMenu/CircleMenu';
import { SElement } from '../../../types';


export interface HasCircleMenu {
  buttons: CircleMenuButton[]
  _menuHoverItem?: HTMLElement
}


export const HasCircleMenuMixin = (superclass: new () => LitElement) =>
  class HasCircleMenu extends superclass implements HasCircleMenu {
    buttons?: CircleMenuButton[]
    get _menuHoverItem() { return this }


    private _app = document.querySelector(SElement.app)!;

    private __menuOpen: boolean = false;
    public get _menuOpen(): boolean {
      return this.__menuOpen;
    }
    public set _menuOpen(v: boolean) {
      this.__menuOpen = v;
      this.requestUpdate();
    }


    connectedCallback() {
      super.connectedCallback();
      this._menuHoverItem.addEventListener('mouseover', () => this._menuOpen = true);
      this._menuHoverItem.addEventListener('mouseout', () => this._menuOpen = false);
    }


    render() {
      const root = super.render();
      return html`
        ${root}
        <synthia-circle-menu
          open=${this._menuOpen && !this._app.isDragging && !this._app.isConnecting}
          .buttons=${this.buttons}
        ></synthia-circle-menu>`;
    }
  }
