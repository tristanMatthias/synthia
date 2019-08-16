import { customElement, html, LitElement, property } from 'lit-element';
import { proxa } from 'proxa';

import { API_URL } from '../../../config';
import { iconFacebook } from '../../../images/icons/facebook';
import { logoMark } from '../../../images/icons/logo';
import { model } from '../../../lib/Model/Model';
import { AppState, state } from '../../../state/state';
import { SElement } from '../../../types';
import { AppEvents } from '../../App/App';
import styles from './header.styles';

export * from './ProjectName';
export * from './HeaderSocial';
export * from './HeaderProjectOwner';

@customElement(SElement.header)
export class Header extends LitElement {
  static styles = [styles];

  user: AppState['user']
  app = document.querySelector(SElement.app)!;

  @property()
  private _showUserContext: boolean = false;



  constructor() {
    super();
    this.user = proxa(state.user, () => this.requestUpdate());
    this.app.addEventListener(AppEvents.loadProject, () => this.requestUpdate())
  }

  render() {
    return html`<div class="wrapper">
      <div class="logo">${logoMark}</div>

      ${model.file
        ? state.user.data && state.user.data.id === model.file.creatorId
          ? html`<header-project-owner></header-project-owner>`
          : html`<header-social></header-social>`
        : null
      }

      ${(!this.user.loading && this.user.checked) ?
        this.user.data
          ? this._user
          : html`<synthia-button color="text" class="login">
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
      class="user ${this._showUserContext ? 'active' : ''}"
      @click=${() => this._showUserContext = !this._showUserContext}
    >
      <img src="${this.user.data.socialPic}">
      <span>${this.user.data.firstName}
    </div>
    <synthia-context-menu .show=${this._showUserContext}>
      <div @click=${this.app.logout}>Logout</div>
    </synthia-context-menu>`
  }
}
