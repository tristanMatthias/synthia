import { EUser } from '@synthia/api/dist/gql/entities/UserEntity';
import { customElement, html, LitElement, css } from 'lit-element';

import { API } from '../../lib/API/API';
import { wrapProxy } from '../../lib/Model/wrapProxy';
import { AppState, state } from '../../state/state';
import { SElement } from '../../types';

@customElement(SElement.app)
export class App extends LitElement {
  static get styles() {
    return [css`:host { display: block;}`]
  }

  user: AppState['user']

  constructor() {
    super();
    this.user = wrapProxy(state.user, (user, prop) => {
      if (user.token && prop === 'token') this._updateMe();
    });
    if (this.user.token) this._updateMe();
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
    const me = await API.request<EUser>('query', 'me');
    state.user.loading = false;
    state.user.checked = true;
    state.user.data = me;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
