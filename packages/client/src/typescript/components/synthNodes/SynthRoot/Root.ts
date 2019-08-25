import { html } from 'lit-element';

import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { SElement } from '../../../types';
import { BaseNode } from '../SynthBaseNode/BaseNode';
import styles from './root.styles';


export class Root extends BaseNode<any, any> {

  static get styles() {
    return [styles]
  }

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path class="border" d="M50 10l34.641 20v40L50 90 15.359 70V30z"/>
        <path class="center" d="M60.347 32.68l10 17.32-10 17.32h-20l-10-17.32 10-17.32z" />
        <g class="shape" transform="translate(37.711 37.847)">
          <path stroke="var(--color-feature)" stroke-linecap="square" d="M12.905.662v23.784"/>
          <circle stroke="var(--color-feature)" cx="12.813" cy="12.421" r="7.912"/>
          <circle stroke="var(--color-feature)" cx="12.813" cy="12.421" r="3.656"/>
          <circle stroke="var(--color-feature)" cx="12.813" cy="12.421" r="1.352"/>
          <path stroke="var(--color-feature)" d="M12.49.662C5.922.662.598 5.986.598 12.554M12.49 24.446c6.568 0 11.892-5.325 11.892-11.892"/>
        </g>
      </svg>`;
  }
}

window.customElements.define(
  SElement.root,
  mix(Root, [
    SelectableMixin,
    ReceivableMixin
  ])
);


declare global {
  interface HTMLElementTagNameMap {
    [SElement.root]: Root;
  }
}
