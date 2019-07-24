import { html, LitElement, property, query, queryAll } from 'lit-element';

import { iconConnect } from '../../icons/connect';
import { iconOscillator } from '../../icons/oscillator';
import { iconWaveSawtooth } from '../../icons/waveSawtooth';
import { iconWaveSine } from '../../icons/waveSine';
import { iconWaveSquare } from '../../icons/waveSquare';
import { Connectable, ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenu, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { Waveform } from '../Waveform/Waveform';
import styles from './oscillator.styles';
import { iconPlay } from '../../icons/play';
import { iconPause } from '../../icons/pause';
import { StorageKey, Storage } from '../../lib/storage';


const icons = {
  sine: iconWaveSine,
  sawtooth: iconWaveSawtooth,
  square: iconWaveSquare,
}

export class Oscillator extends LitElement implements Connectable, HasCircleMenu {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo() { return Promise.resolve(true) }
  disconnectFrom() { return Promise.resolve(true) }
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;


  multipleConnections = true;

  private _toaster = document.querySelector(SElement.toaster)!;
  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  osc?: OscillatorNode;
  get output() {
    return this.osc;
  }


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


  get buttons(): CircleMenuButton[] {
    const action = (type: OscillatorType) => () => this.type = type;
    return [
      { text: 'Square wave', icon: icons.square, action: action('square'), active: this.type === 'square' },
      { text: 'Sine wave', icon: icons.sine, action: action('sine'), active: this.type === 'sine' },
      { text: 'Sawtooth wave', icon: icons.sawtooth, action: action('sawtooth'), active: this.type === 'sawtooth' },
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
      {
        text: this.playing ? 'Pause' : 'Play',
        icon: this.playing ? iconPause : iconPlay,
        action: this.toggle,
        color: 'text'
      },

    ]
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

      if (!Storage.get(StorageKey.notifiedOscillatorPlay)) {
        this._toaster.info('Pro tip: You can play an oscillator by selecting it and pressing the space bar');
        Storage.set(StorageKey.notifiedOscillatorPlay, true)
      }
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
      <div class="background"> ${iconOscillator} </div>
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
