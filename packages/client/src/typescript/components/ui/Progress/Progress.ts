import { customElement, html, LitElement } from 'lit-element';

import { SElement } from '../../../types';
import styles from './progress.styles';


@customElement(SElement.progress)
export class Progress extends LitElement {

  static styles = [styles];

  private _percentage: number;
  public get percentage() {
    return this._percentage;
  }
  public set percentage(v) {
    let val = Math.round(v);
    this._percentage = val;
    if (val > 100) this._percentage = 100;
    if (val < 0) this._percentage = 0;
    this.requestUpdate();
  }


  render() {
    return html`
      <span style="width: ${this.percentage}%" class=${this.percentage === 100 ? 'done' : ''}></span>
      <!-- <span>${this.percentage}%</span> -->
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.progress]: Progress;
  }
}
