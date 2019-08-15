import { customElement, html, LitElement, property } from 'lit-element';

import { API_URL } from '../../../config';
import { iconFacebook } from '../../../images/icons/facebook';
import { logo } from '../../../images/icons/logo';
import { wrapProxy } from '../../../lib/Model/wrapProxy';
import { AppState, state } from '../../../state/state';
import { SElement } from '../../../types';
import styles from './header.styles';
import { model } from '../../../lib/Model/Model';
import { AppEvents } from '../../App/App';
import { FileBarOptions } from '../../ui/FileBar/FileBar';
import { fileService } from '../../../lib/File/FileService';

@customElement(SElement.header)
export class Header extends LitElement {
  static styles = [styles];

  user: AppState['user']
  app = document.querySelector(SElement.app)!;

  @property()
  private _showUserContext: boolean = false;

  private _fileBarOptions: FileBarOptions = {
    'File': [
      {
        action: () => this.app.modal.open(SElement.modalOpenProject),
        text: 'Open project'
      },
      {
        action: () => this.app.modal.open(SElement.modalCreateProject),
        text: 'New project'
      },
      {
        action: () => fileService.openFile(),
        text: 'Import .synth file'
      },
      {
        action: () => fileService.download(),
        text: 'Download'
      }
    ]
  }

  constructor() {
    super();
    this.user = wrapProxy(state.user, () => this.requestUpdate());
    this.app.addEventListener(AppEvents.loadProject, () => this.requestUpdate())
  }

  render() {
    return html`<div class="wrapper">
      <div class="logo">${logo}</div>

      ${model.file
        ? html`
          <div class="file">
            <h1>${model.file.name}</h1>
            <synthia-file-bar .options=${this._fileBarOptions}></synthia-file-bar>
          </div>

        ` : null
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
