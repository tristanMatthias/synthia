import {ETokenResult} from '@synthia/api';
import { customElement, html, property } from 'lit-element';

import { API } from '../../../lib/API/API';
import { History } from '../../../lib/History';
import { state } from '../../../state/state';
import { SElement } from '../../../types';
import { Page } from '../../layout/Page/Page';

@customElement(SElement.oauthPage)
export class PageOAuth extends Page {
  pageTitle = 'Logging in...';
  provider?: string;

  @property()
  error?: string;

  @property()
  code?: string;

  render() {
    return html`
      <span class="center">${
        this.error
          ? this.error
          : `Hang tight, logging you in with ${this.provider}...`
      }</span>
    `;
  }

  async firstUpdated() {
    if (!this.code) return;

    let data: ETokenResult;
    try {
      data = await API.oauthCallback({code: this.code, provider: this.provider!})
    } catch (e) {
      this.error = e.message;
      return false;
    }

    API.authenticate(data.accessToken);
    state.user.token = data.accessToken;

    History.history.replace('/');

    return true;
  }
}
