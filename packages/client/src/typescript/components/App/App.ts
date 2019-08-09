import { EUser } from '@synthia/api/dist/gql/entities/UserEntity';
import { customElement, html, LitElement, css } from 'lit-element';

import { API } from '../../lib/API/API';
import { wrapProxy } from '../../lib/Model/wrapProxy';
import { AppState, state } from '../../state/state';
import { SElement } from '../../types';
import { FileService } from '../../lib/File/FileService';
import { Model } from '../../lib/Model/Model';
import { SynthiaProject } from '@synthia/api';

export enum AppEvents {
  loadProject = 'loadProject'
}

@customElement(SElement.app)
export class App extends LitElement {
  static get styles() {
    return [css`:host { display: block;}`]
  }

  fileService = new FileService();
  model: Model;
  user: AppState['user']

  constructor() {
    super();
    this.user = wrapProxy(state.user, (user, prop) => {
      if (user.token && prop === 'token') this._updateMe();
    });
    if (this.user.token) this._updateMe();
    else this.user.checked = true;

    this.fileService.on('loaded', this.loadProject.bind(this));
  }

  render() {
    return html`<slot></slot>`;
  }

  firstUpdated() {
    this.fileService.loadDefault();
  }

  loadProject(file: SynthiaProject) {
    this.model = new Model(file);
    this.dispatchEvent(new CustomEvent(AppEvents.loadProject, {
      detail: {file, mode: this.model}
    }))
  }

  logout() {
    this.user.token = null;
    this.user.data = null;
    localStorage.removeItem('token');
  }


  private async _updateMe() {
    state.user.loading = true;

    try {
      const me = await API.request<EUser>('query', 'me');
      state.user.data = me;
    } catch (e) {}

    state.user.loading = false;
    state.user.checked = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
