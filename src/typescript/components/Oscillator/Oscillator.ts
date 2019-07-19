import { customElement, html, LitElement } from 'lit-element';

import styles from './oscillator.styles';
import { ElementRoot } from '../Root/Root';


@customElement('synthia-oscillator')
export class Oscillator extends LitElement {

  static get styles() {
    return [styles]
  }


  root = document.querySelector(ElementRoot)!
  ctx = this.root.context
  osc = this.ctx.createOscillator();


  constructor() {
    super();
    this.osc.connect(this.ctx.destination);
  }

  get frequency() {
    return this.osc.frequency.value;
  }
  set frequency(v: number) {
    this.osc.frequency.value = v;
  }


  play() {
    this.osc.start();
  }
  pause() {
    this.osc.stop();
  }


  render() {
    return html`Hey`;
  }


  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.play.bind(this));
  }
}
