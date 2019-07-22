import { html, LitElement } from 'lit-element';

import { SElement } from '../../types';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import styles from './root.styles';
import { ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { mix } from '../../mixins/mix';


export class Root extends LitElement {
  static get styles() {
    return [styles]
  }

  private _app = document.querySelector(SElement.app)!;

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path class="border" d="M50 10l34.641 20v40L50 90 15.359 70V30z"/>
        <path class="center" d="M60.347 32.68l10 17.32-10 17.32h-20l-10-17.32 10-17.32z" />
        <g class="shape" transform="translate(37.711 37.847)">
          <path stroke-linecap="square" d="M12.905.662v23.784"/>
          <circle cx="12.813" cy="12.421" r="7.912"/>
          <circle cx="12.813" cy="12.421" r="3.656"/>
          <circle cx="12.813" cy="12.421" r="1.352"/>
          <path d="M12.49.662C5.922.662.598 5.986.598 12.554M12.49 24.446c6.568 0 11.892-5.325 11.892-11.892"/>
        </g>
      </svg>`;
  }


  connect(node: AudioNode) {
    node.connect(this._app.mainWaveform.analyser);
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
