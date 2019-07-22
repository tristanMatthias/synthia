import { html, LitElement, property, query } from 'lit-element';

import { oscillator2 } from '../../icons/oscillator2';
import { waveSawtooth } from '../../icons/waveSawtooth';
import { waveSine } from '../../icons/waveSine';
import { waveSquare } from '../../icons/waveSquare';
import { SElement } from '../../types';
import styles from './oscillator.styles';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { DraggableMixin, Position } from '../../mixins/Draggable/Draggable';
import { Waveform } from '../Waveform/Waveform';
import { Root } from '../Root/Root';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { connect } from '../../icons/connect';


const icons = {
  sine: waveSine,
  sawtooth: waveSawtooth,
  square: waveSquare,
}

export class Oscillator extends LitElement {

  static get styles() {
    return [styles]
  }


  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  osc?: OscillatorNode;

  // Inherited
  selected?: boolean;

  @property()
  playing: boolean = false;

  @property()
  private _connectedTo: Root | null = null;

  @property()
  private _menuOpen: boolean = false;

  @property()
  connecting: boolean = false;

  @property()
  private _mousePos: Position | null = null;


  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this._keyDown = this._keyDown.bind(this);
    this._updateConnect = this._updateConnect.bind(this);
    this.endConnect = this.endConnect.bind(this);
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
    if (this.connecting) {
      this.connecting = false;
    }
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
    // @ts-ignore
    const buttons = Object.entries(icons).map(([type, icon], i) => {
      let t = type as OscillatorType;
      return html`
        <synthia-button slot="button-${i}" @click=${() => this.type = t}>${icon}</synthia-button>
      `})

    buttons.push(html`<synthia-button slot="button-${3}" @click=${this.startConnect}>${connect}</synthia-button>`);

    return html`
      <div class="background">
        ${oscillator2}
      </div>
      ${this._connectedTo || (this.connecting && this._mousePos)
        ? html`<synthia-waveform class="${this.playing ? 'playing' : ''}"></synthia-waveform>`
        : null
      }

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


  updated() {
    if (this._connectedTo || this.connecting) {
      const thisBox = this.getBoundingClientRect() as DOMRect;

      const thisX = thisBox.x + thisBox.width / 2;
      const thisY = thisBox.y + thisBox.height / 2;

      let destX: number;
      let destY: number;

      if (this._connectedTo) {
        const connectedBox = this._connectedTo.getBoundingClientRect() as DOMRect;
        destX = connectedBox.x + connectedBox.width / 2;
        destY = connectedBox.y + connectedBox.height / 2;
      } else {
        destX = this._mousePos!.x;
        destY = this._mousePos!.y;
      }

      const angleRad = Math.atan((thisY - destY) / (thisX - destX));
      let angleDeg = angleRad * 180 / Math.PI;

      let distance = Math.sqrt(((thisX - destX) ** 2) + ((thisY - destY) ** 2));
      if (!this.connecting) distance -= 120;
      else distance -= 60;

      if (thisX >= destX) angleDeg += 180;

      if (distance < 0) distance = 0;


      this.waveform!.style.transform = `translateY(-50%) rotate(${angleDeg}deg) translateX(60px)`
      this.waveform!.width = distance;
      this.background!.style.transform = `rotate(${angleDeg + 90}deg)`
    }
  }

  private _keyDown(e: KeyboardEvent) {
    if (this.selected && e.code === 'Space') this.toggle();
    if (this.connecting && e.code == 'Escape') this.endConnect();
  }


  startConnect() {
    this.connecting = true;
    this._connectedTo = null;
    this._mousePos = null;
    window.addEventListener('mousemove', this._updateConnect);
    setTimeout(() => {
      window.addEventListener('click', this.endConnect);
    }, 100)
  }

  private _updateConnect(e: MouseEvent) {
    this._mousePos = {x: e.clientX, y: e.clientY}
  }

  endConnect(e?: MouseEvent) {
    this.connecting = false;
    window.removeEventListener('mousemove', this._updateConnect);
    window.removeEventListener('click', this.endConnect);

    if (e && e.target instanceof Root) {
      this.connectTo(e.target);
    }
  }
}


let oscillator = DraggableMixin(Oscillator);
let selectable = SelectableMixin(oscillator);
let deletable = DeletableMixin(selectable);

window.customElements.define(SElement.oscillator, deletable);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.oscillator]: Oscillator;
  }
}
