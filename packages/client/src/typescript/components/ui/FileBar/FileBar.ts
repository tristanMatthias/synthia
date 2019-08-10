import { customElement, html, LitElement, property } from 'lit-element';

import { SElement } from '../../../types';
import styles from './file-bar.styles';
import { ContextMenuItem } from '../ContextMenu/ContextMenu';

export interface FileBarOptions {
  [key: string]: ContextMenuItem[];
}

@customElement(SElement.fileBar)
export class FileBar extends LitElement {
  static styles = [styles];

  @property()
  options: FileBarOptions = {};

  @property()
  private _active = false;

  @property()
  private _activeTab: keyof FileBarOptions | null = null;

  render() {
    const buttons = Object.keys(this.options).map(k =>
      html`<synthia-button
        hollow="hollow"
        color='text'
        class="${this._activeTab === k && this._active ? 'active' : null}"
        @mouseenter=${() => this._activeTab = k}
        @click=${() => this._active = !this._active}
      >${k}</synthia-button>`
    );

    let menu;
    if (this._active && this._activeTab) {
      menu = html`<synthia-context-menu
        .items=${this.options[this._activeTab]}
        .show=${true}
        @closed=${() => {
          this._active = false;
          this._activeTab = null
        }}
      ></synthia-context-menu>`;
    }
    return html`${buttons}${menu}`;
  }

}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.fileBar]: FileBar;
  }
}
