import { SynthiaProject } from '@synthia/api';
import { css, customElement, html, LitElement } from 'lit-element';

import { API } from '../../lib/API/API';
import { FileService } from '../../lib/File/FileService';
import { model } from '../../lib/Model/Model';
import { wrapProxy } from '../../lib/Model/wrapProxy';
import { AppState, state } from '../../state/state';
import { SElement } from '../../types';

export enum AppEvents {
  loadProject = 'loadProject'
}

@customElement(SElement.app)
export class App extends LitElement {
  static get styles() {
    return [css`:host { display: block;}`]
  }

  fileService = new FileService();
  model = model;
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
    this.model.loadNewFile(file);
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
      const me = await API.me();
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
