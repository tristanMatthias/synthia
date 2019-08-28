import { LitElement, html, css, customElement, property } from "lit-element";
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
      background: var(--color-text-alt);
    }`
  ]

  @property({reflect: true, type: Number})
  offset: number = 0;

  @property({reflect: true, type: Number})
  duration: number;

  connectedCallback() {
    super.connectedCallback();

    const updateTime = debounce(() => {
      let inRange = true;
      const current = Clock.currentBeat;

      if (
        (current < this.offset) ||
        (this.duration !== undefined && (current > (this.offset + this.duration)))
      ) inRange = false;

      // TODO: Different timing
      if (inRange) {
        this.style.left = `calc(${current - this.offset} * var(--clip-width))`;
        this.style.display = 'block';
      } else this.style.display = 'none';

      this.requestUpdate();
      updateTime();

    }, 0, {
      maxWait: 500
    });

    if (this.isConnected) requestAnimationFrame(updateTime)
  }

  render() {
    return html``;
  }
}
