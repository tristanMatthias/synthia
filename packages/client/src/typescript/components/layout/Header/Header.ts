import { customElement, html, LitElement, property } from 'lit-element';

import { API_URL } from '../../../config';
import { iconFacebook } from '../../../images/icons/facebook';
import { logo } from '../../../images/icons/logo';
import { wrapProxy } from '../../../lib/Model/wrapProxy';
import { AppState, state } from '../../../state/state';
import { SElement } from '../../../types';
import styles from './header.styles';

@customElement(SElement.header)
export class Header extends LitElement {
  static styles = [styles];

  user: AppState['user']
  app = document.querySelector(SElement.app)!;

  @property()
  private _showContext: boolean = false;

  constructor() {
    super();
    this.user = wrapProxy(state.user, () => {
      this.requestUpdate()
    });

  }

  render() {
    return html`<div class="wrapper">
      <div class="logo">${logo}</div>
      ${(!this.user.loading && this.user.checked) ?
        this.user.data
          ? this._user
          : html`<synthia-button color="text">
            <a href="${API_URL}/oauth/facebook">
              ${iconFacebook}
              <span>Login</span>
            </a>
          </synthia-button>`
        : null
      }
    </div>`;
  }

  get _user() {
    if (!this.user.data) return null;

    return html`<div
      class="user ${this._showContext ? 'active' : ''}"
      @click=${() => this._showContext = !this._showContext}
    >
      <img src="${this.user.data.socialPic}">
      <span>${this.user.data.firstName}
    </div>
    <synthia-context-menu .show=${this._showContext}>
      <div @click=${this.app.logout}>Logout</div>
    </synthia-context-menu>`
  }
}
