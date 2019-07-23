import { html, LitElement, query, queryAll } from 'lit-element';

import { connect } from '../../icons/connect';
import { filter } from '../../icons/filter';
import { filterHighPass } from '../../icons/filterHighPass';
import { filterLowPass } from '../../icons/filterLowPass';
import { Connectable, ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenu, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { ReceivableMixin, Receivable } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { Waveform } from '../Waveform/Waveform';
import styles from './filter.styles';


const icons = {
  lowpass: filterLowPass,
  highpass: filterHighPass
}

export class Filter extends LitElement implements Connectable, HasCircleMenu, Receivable {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo(): boolean { return true }
  // Receiveable
  canReceive = true
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;


  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  filter: BiquadFilterNode = this.ctx.createBiquadFilter();
  multipleConnections = false;
  get input() {
    return this.shadowRoot!.querySelector(SElement.waveform)!.analyser;
  }
  output = this.filter;
  connect() { return true };
  disconnect() { return true }


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
    const action = (type: BiquadFilterType) => () => this.type = type;
    return [
      { text: 'High pass', icon: icons.highpass, action: action('highpass'), active: this.type ===  'highpass' },
      { text: 'Low pass', icon: icons.lowpass, action: action('lowpass'), active: this.type ===  'lowpass' },
      { text: 'Connect', icon: connect, action: () => this._startConnect(), color: 'text' }
    ];
  }


  @queryAll(SElement.waveform)
  waveforms?: Waveform[];

  @query('.background')
  background?: HTMLElement;


  constructor() {
    super();
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
    this.filter.type = 'allpass';
  }


  private _frequency: number = 100;
  get frequency() {
    return this._frequency;
  }
  set frequency(v: number) {
    this._frequency = v;
    if (this.filter) this.filter.frequency.value = v;
    this.requestUpdate();
  }


  private _type: BiquadFilterType = 'highpass';
  get type() {
    return this._type;
  }
  set type(v: BiquadFilterType) {
    this._type = v;
    if (this.filter) this.filter.type = v;
    this.requestUpdate();
  }


  render() {
    return html`
      <div class="background"> ${filter} </div>
      <div class="icon">${this.icon}</div>
    `;
  }


  firstUpdated(props: Map<keyof Filter, any>) {
    super.firstUpdated(props);
    this.filter.connect(this.output);
  }
}

window.customElements.define(
  SElement.filter,
  mix(Filter, [
    DraggableMixin,
    SelectableMixin,
    DeletableMixin,
    ConnectableMixin,
    ReceivableMixin,
    HasCircleMenuMixin
  ])
);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.filter]: Filter;
  }
}
