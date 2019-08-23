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


    private _synth = document.querySelector(SElement.synthPage)!;

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
        <s-circle-menu
          open=${this._menuOpen && !this._synth.isDragging && !this._synth.isConnecting}
          .buttons=${this.buttons}
        ></s-circle-menu>`;
    }
  }
