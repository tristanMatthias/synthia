import { html, LitElement, property, query, queryAll } from 'lit-element';

import { connect } from '../../icons/connect';
import { oscillator2 } from '../../icons/oscillator2';
import { waveSawtooth } from '../../icons/waveSawtooth';
import { waveSine } from '../../icons/waveSine';
import { waveSquare } from '../../icons/waveSquare';
import { Connectable, ConnectableMixin, ConnectableEvents } from '../../mixins/Connectable/Connectable';
import { mix } from '../../mixins/mix';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { Receivable } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { Waveform } from '../Waveform/Waveform';
import styles from './oscillator.styles';
import { HasCircleMenu, CircleMenuButton, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';


const icons = {
  sine: waveSine,
  sawtooth: waveSawtooth,
  square: waveSquare,
}

export class Oscillator extends LitElement implements Connectable, HasCircleMenu {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo(node: Receivable): void { }
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;




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


  get buttons() {
    const buttons: CircleMenuButton[] = Object.entries(icons).map(([type, icon], i) => {
      let t = type as OscillatorType;
      return {
        icon,
        action: () => this.type = t
      };
    })

    buttons.push({ action: this._startConnect, icon: connect });

    return buttons;
  }


  @queryAll(SElement.waveform)
  waveforms?: Waveform[];

  @query('.background')
  background?: HTMLElement;


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
      this.osc!.disconnect();
      this.playing = false;
    }
  }


  render() {
    return html`
      <div class="background"> ${oscillator2} </div>
      <div class="icon">${this.icon}</div>
    `;
  }


  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._keyDown);
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

window.customElements.define(
  SElement.oscillator,
  mix(Oscillator, [
    DraggableMixin,
    SelectableMixin,
    DeletableMixin,
    ConnectableMixin,
    HasCircleMenuMixin
  ])
);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.oscillator]: Oscillator;
  }
}
