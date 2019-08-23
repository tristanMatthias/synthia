import { customElement, html, LitElement, property } from 'lit-element';
import { proxa } from 'proxa';

import { API_URL } from '../../../config';
import { iconFacebook } from '../../../images/icons/facebook';
import { logoMark } from '../../../images/icons/logo';
import { project } from '../../../lib/Project/Project';
import { AppState, state } from '../../../state/state';
import { SElement } from '../../../types';
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
    project.on('loadedNewProject', () => this.requestUpdate());
    project.on('close', () => this.requestUpdate());
  }

  render() {
    return html`
      <a class="logo" href="/">${logoMark}</a>

      ${project.file
        ? state.user.data && state.user.data.id === project.file.creatorId
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
    `;
  }

  get _user() {
    if (!this.user.data) return null;

    return html`<div class="user">
      <div
        class="badge ${this._showUserContext ? 'active' : ''}"
        @click=${() => this._showUserContext = !this._showUserContext}
      >
        <img src="${this.user.data.socialPic}">
        <span>${this.user.data.firstName}
      </div>
      <synthia-context-menu .show=${this._showUserContext}>
        <div @click=${this.app.logout}>Logout</div>
      </synthia-context-menu>
    </div>`;
  }
}
