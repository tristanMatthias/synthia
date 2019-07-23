import { html, LitElement, query, queryAll } from 'lit-element';
import { iconConnect } from '../../icons/connect';
import { iconFilter } from '../../icons/filter';
import { iconFilterAllPass } from '../../icons/filterAllPass';
import { iconFilterBandPass } from '../../icons/filterBandPass';
import { iconFilterHighPass } from '../../icons/filterHighPass';
import { iconFilterHighShelf } from '../../icons/filterHighShelf';
import { iconFilterLowPass } from '../../icons/filterLowPass';
import { iconFilterLowShelf } from '../../icons/filterLowShelf';
import { iconFilterNotch } from '../../icons/filterNotch';
import { iconFilterPeaking } from '../../icons/filterPeaking';
import { Connectable, ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenu, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { Receivable, ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { SidebarEvents } from '../Sidebar/Sidebar';
import { Waveform } from '../Waveform/Waveform';
import styles from './filter.styles';
import { FilterSidebar } from './FilterSidebar/FilterSidebar';
import { iconSettings } from '../../icons/settings';



const icons = {
  allpass: iconFilterAllPass,
  bandpass: iconFilterBandPass,
  highpass: iconFilterHighPass,
  highshelf: iconFilterHighShelf,
  lowpass: iconFilterLowPass,
  lowshelf: iconFilterLowShelf,
  notch: iconFilterNotch,
  peaking: iconFilterPeaking,
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
  get output() {
    return this.shadowRoot!.querySelector(SElement.waveform)!.analyser;
  }
  get input() {
    return this.filter;
  }
  connect() { return true };
  disconnect() { return true }


  private _sidebar: FilterSidebar | null = null;


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
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
      { text: 'Settings', icon: iconSettings, action: () => this.toggleSidebar(), color: 'text' }
    ];
  }


  @queryAll(SElement.waveform)
  waveforms?: Waveform[];

  @query('.background')
  background?: HTMLElement;


  constructor() {
    super();
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
    this.filter.type = 'highpass';
    this.filter.Q.value = 5;
    this.filter.frequency.value = 2000;
    this.filter.gain.value = 0.1;
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


  private _gain: number = 0;
  get gain() {
    return this._gain;
  }
  set gain(v: number) {
    this._gain = v;
    if (this.filter) this.filter.gain.value = v;
    this.requestUpdate();
  }

  private _q: number = 0;
  get q() {
    return this._q;
  }
  set q(v: number) {
    this._q = v;
    if (this.filter) this.filter.Q.value = v;
    this.requestUpdate();
  }


  render() {
    return html`
      <div class="background"> ${iconFilter} </div>
      <div class="icon">${this.icon}</div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', () => this.toggleSidebar());
  }

  firstUpdated(props: Map<keyof Filter, any>) {
    super.firstUpdated(props);
    this.filter.connect(this.output);
  }


  toggleSidebar(force?: boolean) {
    if (this._sidebar || force) {
      if (this._sidebar) this._sidebar.remove();
      this._sidebar = null;
    } else {
      const sidebar = new FilterSidebar();
      sidebar.filter = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;
    }
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
