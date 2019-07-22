import { html, LitElement, property, query, queryAll } from 'lit-element';

import { connect } from '../../icons/connect';
import { oscillator2 } from '../../icons/oscillator2';
import { waveSawtooth } from '../../icons/waveSawtooth';
import { waveSine } from '../../icons/waveSine';
import { waveSquare } from '../../icons/waveSquare';
import { Connectable, ConnectableMixin, ConnectableEvents } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { Receivable } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { Waveform } from '../Waveform/Waveform';
import styles from './oscillator.styles';


const icons = {
  sine: waveSine,
  sawtooth: waveSawtooth,
  square: waveSquare,
}

export class Oscillator extends LitElement implements Connectable {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo(node: Receivable): void { }
  // Connectable
  protected _startConnect() { }




  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  osc?: OscillatorNode;


  @property()
  playing: boolean = false;

  set x(x: number) {
    this.style.left = `${x}px`;
  }
  set y(y: number) {
    this.style.top = `${y}px`;
  }

  get icon() {
    // @ts-ignore
    return icons[this.type];
  }


  @queryAll(SElement.waveform)
  waveforms?: Waveform[];

  @query('.background')
  background?: HTMLElement;


  @property()
  private _menuOpen: boolean = false;




  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this._keyDown = this._keyDown.bind(this);
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    })
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


  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }


  play() {
    if (!this.playing) {
      this.osc = this.ctx.createOscillator();
      this.waveforms!.forEach(wf => this.osc!.connect(wf.analyser))
      this.frequency = this.frequency;
      this.osc.type = this.type;
      this.osc.start();
      this.playing = true;
    }
  }

  pause() {
    if (this.playing) {
      this.osc!.stop();
      this.playing = false;
    }
  }


  render() {
    // @ts-ignore
    const buttons = Object.entries(icons).map(([type, icon], i) => {
      let t = type as OscillatorType;
      return html`
        <synthia-button slot="button-${i}" @click=${() => this.type = t}>${icon}</synthia-button>
      `})

    buttons.push(html`<synthia-button slot="button-${3}" @click=${this._startConnect}>${
      connect
    }</synthia-button>`);

    return html`
      <div class="background">
        ${oscillator2}
      </div>

      <div class="icon">${this.icon}</div>

      <synthia-circle-menu open=${this._menuOpen && !this._app.isDragging}>
        ${buttons}
      </synthia-circle-menu>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._keyDown);
    this.addEventListener('mouseover', () => this._menuOpen = true);
    this.addEventListener('mouseout', () => this._menuOpen = false);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._keyDown);
    this.pause();
  }

  private _keyDown(e: KeyboardEvent) {
    if (this.selected && e.code === 'Space') this.toggle();
  }


}


let oscillator = DraggableMixin(Oscillator);
let selectable = SelectableMixin(oscillator);
let deletable = DeletableMixin(selectable);
let connectable = ConnectableMixin(deletable);

window.customElements.define(SElement.oscillator, connectable);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.oscillator]: Oscillator;
  }
}
