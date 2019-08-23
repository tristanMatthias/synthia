import { css, customElement, html, LitElement } from 'lit-element';
import { proxa } from 'proxa';

import { API } from '../../lib/API/API';
import { project } from '../../lib/Project/Project';
import { AppState, state } from '../../state/state';
import { SElement } from '../../types';
import { ModalContainerEvents } from '../ui/Modal/ModalContainers';

@customElement(SElement.app)
export class App extends LitElement {
  static get styles() {
    return [css`
      :host { display: block; transition: filter 0.3s; }
      ::slotted(s-app-router) {
        position: fixed;
        top: var(--header-height);
        bottom: 0;
        left: 0;
        width: 100%;
      }
    `]
  }


  project = project;
  user: AppState['user']
  modal = document.querySelector(SElement.modalContainer)!;


  constructor() {
    super();
    this.user = proxa(state.user, (user, prop) => {
      if (user.token && prop === 'token') this._updateMe();
    });
    if (this.user.token) this._updateMe();
    else this.user.checked = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.modal.addEventListener(ModalContainerEvents.open, () => {
      this.style.filter = 'blur(4px)';
    });
    this.modal.addEventListener(ModalContainerEvents.close, () => {
      this.style.filter = '';
    });
  }

  render() {
    return html`<slot></slot>`;
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
