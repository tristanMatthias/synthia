import { html, LitElement } from 'lit-element';

import { oscillator2 } from '../../icons/oscillator2';
import { waveSawtooth } from '../../icons/waveSawtooth';
import { waveSine } from '../../icons/waveSine';
import { waveSquare } from '../../icons/waveSquare';
import { SElement } from '../../types';
import styles from './oscillator.styles';
import { SelectableMixin } from '../Selectable/Selectable';
import { DraggableMixin } from '../Draggable/Draggable';


const icons = {
  sine: waveSine,
  sawtooth: waveSawtooth,
  square: waveSquare,
}

export class Oscillator extends LitElement {

  static get styles() {
    return [styles]
  }


  root = document.querySelector(SElement.root)!
  ctx = this.root.context
  osc = this.ctx.createOscillator();


  constructor() {
    super();
    this.osc.connect(document.querySelector(SElement.waveform)!.analyser);
    this.frequency = 100;
    this.osc.type = 'sawtooth';
  }


  set x(x: number) {
    this.style.left = `${x}px`;
  }
  set y(y: number) {
    this.style.top = `${y}px`;
  }


  get frequency() {
    return this.osc.frequency.value;
  }
  set frequency(v: number) {
    this.osc.frequency.value = v;
  }

  get type() {
    return this.osc.type;
  }
  set type(v: OscillatorType) {
    this.osc.type = v;
    this.requestUpdate();
  }


  play() {
    this.osc.start();
  }
  pause() {
    this.osc.stop();
  }

  get icon() {
    // @ts-ignore
    return icons[this.osc.type];
  }

  render() {
    return html`
      ${oscillator2}
      <div class="icon">${this.icon}</div>
    `;
  }


  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.play.bind(this));
  }
}


let oscillator = DraggableMixin(Oscillator);
let selectable = SelectableMixin(oscillator);

window.customElements.define(SElement.oscillator, selectable);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.oscillator]: Oscillator;
  }
}
