import {EProject} from '@synthia/api';
import { css, customElement, html, LitElement } from 'lit-element';
import { API } from '../../lib/API/API';
import { fileService } from '../../lib/File/FileService';
import { model } from '../../lib/Model/Model';
import { AppState, state } from '../../state/state';
import { SElement } from '../../types';
import { ModalContainerEvents } from '../ui/Modal/ModalContainers';
import {proxa} from 'proxa';

export enum AppEvents {
  loadProject = 'loadProject'
}

@customElement(SElement.app)
export class App extends LitElement {
  static get styles() {
    return [css`:host { display: block; transition: filter 0.3s; }`]
  }

  model = model;
  user: AppState['user']
  modal = document.querySelector(SElement.modalContainer)!;


  constructor() {
    super();
    this.user = proxa(state.user, (user, prop) => {
      if (user.token && prop === 'token') this._updateMe();
    });
    if (this.user.token) this._updateMe();
    else this.user.checked = true;

    fileService.on('loaded', this.loadProject.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.modal.addEventListener(ModalContainerEvents.open, () => {
      this.style.filter = 'blur(4px)';
    });
    this.modal.addEventListener(ModalContainerEvents.close, () => {
      this.style.filter = null;
    });
  }

  render() {
    return html`<slot></slot>`;
  }

  loadProject(file: EProject) {
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
