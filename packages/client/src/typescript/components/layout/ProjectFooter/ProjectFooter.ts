import { customElement, html, LitElement } from "lit-element";
import { SElement } from "../../../types";
import styles from './project-footer.styles';
import { Clock } from "../../../lib/Clock";
import debounce = require("lodash.debounce");

@customElement(SElement.projectFooter)
export class Page extends LitElement {
  static styles = [styles];

  constructor() {
    super();
    this._update = debounce(this._update.bind(this), 100);
    Clock.on('play', this._update);
    Clock.on('seek', () => this.requestUpdate());
  }

  connectedCallback() {
    super.connectedCallback();
    this._update();
  }

  render() {
    return html`
      <div class="clock">
        <span>${Clock.currentBar + 1}</span>.
        <span>${Clock.currentBarBeat + 1}</span>
      </div>
      <s-button
        hollow
        color="main"
        icon="${Clock.playing ? 'pause' : 'play'}"
        @click=${() => Clock.toggle()}
        tooltip=${Clock.playing ? 'Pause' : 'Play'}
      ></s-button>
      <s-button
        hollow
        color="main"
        icon="stop"
        @click=${() => Clock.stop()}
        tooltip="Stop"
      ></s-button>
    `;
  }

  private _update() {
    this.requestUpdate();
    if (this.isConnected && Clock.playing) window.requestAnimationFrame(this._update)
  }
}

