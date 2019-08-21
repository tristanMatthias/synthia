import { LitElement, html, css, customElement } from "lit-element";
import debounce = require("lodash.debounce");
import { Clock } from "../../../lib/Clock";
import { SElement } from "../../../types";

@customElement(SElement.clockLine)
export class ClockLine extends LitElement {
  static styles = [
    css`:host {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 1px;
      background: var(--color-text);
    }`
  ]

  connectedCallback() {
    super.connectedCallback();

    const updateTime = debounce(() => {
      this.style.left = `calc(${Clock.currentBarExact} * var(--note-width) * 4)`;
      this.requestUpdate();
      updateTime();
    }, 0, {
      maxWait: 500
    });
    console.log('updating');

    if (this.isConnected) requestAnimationFrame(updateTime)
  }

  render() {
    return html``;
  }
}
