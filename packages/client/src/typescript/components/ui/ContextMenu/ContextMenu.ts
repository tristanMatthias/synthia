import { customElement, html, LitElement, property } from 'lit-element';

import { SElement } from '../../../types';
import styles from './context-menu.styles';

export enum ContextMenuEvents {
  closed = 'closed'
}

export interface ContextMenuItem {
  text: string;
  action: (e: MouseEvent) => void;
  disabled?: boolean;
}


@customElement(SElement.contextMenu)
export class ContextMenu extends LitElement {

  @property({reflect: true, type: Boolean})
  show: boolean = false;

  items: ContextMenuItem[] = [];

  static get styles() {
    return [styles]
  }

  render() {
    return html`
      <slot></slot>
      ${this.items.map(i => html`<div @click=${this._click(i.action)}>
        <span>${i.text}</span>
      </div>`)}
    `;
  }

  _click(action: (e: MouseEvent) => void) {
    return (e: MouseEvent) => {
      action(e);
      this.dispatchEvent(new CustomEvent(ContextMenuEvents.closed));
    }
  }
}
