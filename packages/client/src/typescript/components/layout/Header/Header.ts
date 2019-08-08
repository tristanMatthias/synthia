import { LitElement, html, customElement, property } from "lit-element";
import styles from './header.styles';
import { logo } from "../../../images/icons/logo";
import { SElement } from "../../../types";
import { API_URL } from "../../../config";
import { state, AppState } from "../../../state/state";
import { wrapProxy } from "../../../lib/Model/wrapProxy";

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
      ${logo}
      ${(!this.user.loading && this.user.checked) ?
        this.user.data
          ? this._user
          : html`<a href="${API_URL}/oauth/facebook"> Login </a>`
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
