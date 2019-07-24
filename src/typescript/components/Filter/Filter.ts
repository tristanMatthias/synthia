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
import { iconSettings } from '../../icons/settings';
import { Connectable, ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenu, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { Receivable, ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { SidebarEvents } from '../Sidebar/Sidebar';
import { Waveform } from '../Waveform/Waveform';
import styles from './filter.styles';
import { FilterSidebar } from './FilterSidebar/FilterSidebar';
import { Storage, StorageKey } from '../../lib/storage';



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

  private _toaster = document.querySelector(SElement.toaster)!;

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
      { text: 'All Pass', icon: icons.allpass, action: action('allpass'), active: this.type == 'allpass' },
      { text: 'Band Pass', icon: icons.bandpass, action: action('bandpass'), active: this.type == 'bandpass' },
      { text: 'High Pass', icon: icons.highpass, action: action('highpass'), active: this.type == 'highpass' },
      { text: 'High Shelf', icon: icons.highshelf, action: action('highshelf'), active: this.type == 'highshelf' },
      { text: 'Low Pass', icon: icons.lowpass, action: action('lowpass'), active: this.type == 'lowpass' },
      { text: 'Low Shelf', icon: icons.lowshelf, action: action('lowshelf'), active: this.type == 'lowshelf' },
      { text: 'Notch', icon: icons.notch, action: action('notch'), active: this.type == 'notch' },
      { text: 'Peaking', icon: icons.peaking, action: action('peaking'), active: this.type == 'peaking' },
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


  private _frequency: number = this.filter.frequency.value;
  get frequency() {
    return this._frequency;
  }
  set frequency(v: number) {
    this._frequency = v;
    if (this.filter) this.filter.frequency.value = v;
    this.requestUpdate();
    this._drawFrequencyArc();
  }


  get type() {
    return this.filter.type;
  }
  set type(v: BiquadFilterType) {
    if (this.filter) this.filter.type = v;
    this.requestUpdate();
  }


  get gain() {
    return this.filter.gain.value;
  }
  set gain(v: number) {
    if (this.filter) this.filter.gain.value = v;
    this.requestUpdate();
  }

  get q() {
    return this.filter.Q.value;
  }
  set q(v: number) {
    if (this.filter) this.filter.Q.value = v;
    this.requestUpdate();
  }


  render() {
    return html`
      <canvas width="120" height="120"></canvas>
      <div class="background"> ${iconFilter} </div>
      <div class="icon">${this.icon}</div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.toggleSidebar(true);
  }

  firstUpdated(props: Map<keyof Filter, any>) {
    super.firstUpdated(props);
    this.filter.connect(this.output);
    this._drawFrequencyArc();
  }


  toggleSidebar(forceRemove?: boolean) {
    if (this._sidebar || forceRemove) {
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

      if (!Storage.get(StorageKey.notifiedFilterSidebar)) {
        this._toaster.info('Pro tip: You can open the Filter settings by double clicking on the filter');
        Storage.set(StorageKey.notifiedFilterSidebar, true)
      }
    }
  }

  private _drawFrequencyArc() {
    const size = 120;
    const ctx = this.shadowRoot!.querySelector('canvas')!.getContext('2d')!;
    const maxFreq = 24000;
    const lineWidth = 6;
    let perc = this.frequency / maxFreq;
    perc = Math.log(perc) / Math.log(maxFreq);
    if (perc == -1) perc = -0.999999;


    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.2;
    ctx.setLineDash([5, 8]);
    ctx.lineWidth = lineWidth;

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-main');;
    ctx.stroke();


    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-alt');;
    ctx.globalAlpha = 0.4;
    ctx.arc(size / 2, size / 2, (size - 2 - lineWidth) / 2, 0, perc * 2 * Math.PI);
    ctx.stroke();
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
