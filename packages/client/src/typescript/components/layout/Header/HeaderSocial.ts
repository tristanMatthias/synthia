import { css, customElement, html, LitElement } from 'lit-element';

import { model } from '../../../lib/Model/Model';

@customElement('header-social')
export class SocialHeader extends LitElement {
  static styles = [
    css`
      :host {
        display: grid;
        grid-template-columns: 5.5rem 1fr;
        grid-template-rows: 3rem 3rem;
      }
      img {
        border-radius: 50%;
        grid-row: span 2;
        margin: 1.5rem 1rem;
        width: 3rem;
      }
      .name {
        line-height: 3rem;
        height: 3rem;
        font-size: 1.6rem;
      }
      small {
        color: var(--color-main);
      }
      h1 {
        position: fixed;
        top: 0;
        line-height: 6rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.8rem;
        margin: 0;
        color: var(--color-white);
        letter-spacing: 1px;
      }
      .buttons {
        line-height: 3rem;
        /* padding-top: 0.2rem; */
      }
      synthia-button {
        vertical-align: top;
      }
    `
  ]

  render() {
    const file = model.file!;
    return html`
      <img src=${file.creator.socialPic} />
      <span class="name">
        <small> by</small>
        ${file.creator.firstName} ${file.creator.lastName}
      </span>
      <div class="buttons">
        <synthia-button small color="text">Follow</synthia-button>
      </div>
      <h1>${file.name}</h1>
    `;
  }
}
