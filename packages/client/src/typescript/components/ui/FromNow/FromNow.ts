import { LitElement, html, customElement } from "lit-element";
import moment from 'moment';
import { SElement } from "../../../types";

@customElement(SElement.fromNow)
export class FromNow extends LitElement {
  time: Date | string = new Date();

  private _interval: number;

  connectedCallback() {
    super.connectedCallback();
    this._interval = setInterval(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._interval);
  }

  render() {
    return html`${moment(this.time).fromNow()}`;
  }
}
