import { html, LitElement, property, query } from 'lit-element';

import { oscillator2 } from '../../icons/oscillator2';
import { waveSawtooth } from '../../icons/waveSawtooth';
import { waveSine } from '../../icons/waveSine';
import { waveSquare } from '../../icons/waveSquare';
import { SElement } from '../../types';
import styles from './oscillator.styles';
import { SelectableMixin } from '../Selectable/Selectable';
import { DraggableMixin } from '../Draggable/Draggable';
import { Waveform } from '../Waveform/Waveform';
import { Root } from '../Root/Root';


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

  osc?: OscillatorNode;


  @property()
  playing: boolean = false;

  @property()
  private _connectedTo?: Root;


  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }


  set x(x: number) {
    this.style.left = `${x}px`;
  }
  set y(y: number) {
    this.style.top = `${y}px`;
  }


  private _frequency: number = 100;
  get frequency() {
    return this._frequency;
  }
  set frequency(v: number) {
    this._frequency = v;
    if (this.osc) this.osc.frequency.value = v;
    this.requestUpdate();
  }


  private _type: OscillatorType = 'sine';
  get type() {
    return this._type;
  }
  set type(v: OscillatorType) {
    this._type = v;
    if (this.osc) this.osc.type = v;
    this.requestUpdate();
  }


  connectTo(item: Root) {
    item.connect(this.waveform!.analyser);
    this._connectedTo = item;
  }


  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }


  play() {
    if (!this.playing) {
      this.osc = this.ctx.createOscillator();
      this.osc.connect(this.waveform!.analyser);
      this.frequency = this.frequency;
      this.osc.type = this.type;
      this.osc.start();
      this.playing = true;
    }
  }

  pause() {
    if (this.playing) {
      console.log('stopping');

      this.osc!.stop();
      this.playing = false;
    }
  }

  get icon() {
    // @ts-ignore
    return icons[this.type];
  }

  @query('.background')
  background?: HTMLElement;

  @query('synthia-waveform')
  waveform?: Waveform

  render() {
    return html`
      <div class="background">
        ${oscillator2}
      </div>
      <synthia-waveform></synthia-waveform>
      <div class="icon">${this.icon}</div>
    `;
  }


  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.toggle);
  }

  firstUpdated() {
    this.connectTo(this.root);
  }

  updated() {
    if (this._connectedTo) {
      const connectedBox = this._connectedTo.getBoundingClientRect() as DOMRect;
      const thisBox = this.getBoundingClientRect() as DOMRect;

      const thisX = thisBox.x + thisBox.width / 2;
      const thisY = thisBox.y + thisBox.height / 2;
      const connectedX = connectedBox.x + connectedBox.width / 2;
      const connectedY = connectedBox.y + connectedBox.height / 2;

      const angleRad = Math.atan((thisY - connectedY) / (thisX - connectedX));
      let angleDeg = angleRad * 180 / Math.PI;

      const distance = Math.sqrt(((thisX - connectedX) ** 2) + ((thisY - connectedY) ** 2)) - 120;

      if (thisX > connectedX) angleDeg += 180;


      this.waveform!.style.transform = `translateY(-50%) rotate(${angleDeg}deg) translateX(60px)`
      this.waveform!.width = distance;
      this.background!.style.transform = `rotate(${angleDeg + 90}deg)`
    }
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
