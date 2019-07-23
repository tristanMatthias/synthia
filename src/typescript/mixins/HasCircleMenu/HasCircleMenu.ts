import { html, LitElement, TemplateResult } from 'lit-element';

import { SElement } from '../../types';
import { CircleMenuButton } from '../../components/CircleMenu/CircleMenu';



export interface HasCircleMenu {
  buttons: CircleMenuButton[]
}


export const HasCircleMenuMixin = (superclass: new () => LitElement) =>
  class HasCircleMenu extends superclass implements HasCircleMenu {
    buttons?: CircleMenuButton[]


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
      this.addEventListener('mouseover', () => this._menuOpen = true);
      this.addEventListener('mouseout', () => this._menuOpen = false);
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
