import { html, query } from 'lit-element';

import { iconConnect } from '../../../images/icons/connect';
import { iconFilter } from '../../../images/icons/filter';
import { iconFilterAllPass } from '../../../images/icons/filterAllPass';
import { iconFilterBandPass } from '../../../images/icons/filterBandPass';
import { iconFilterHighPass } from '../../../images/icons/filterHighPass';
import { iconFilterHighShelf } from '../../../images/icons/filterHighShelf';
import { iconFilterLowPass } from '../../../images/icons/filterLowPass';
import { iconFilterLowShelf } from '../../../images/icons/filterLowShelf';
import { iconFilterNotch } from '../../../images/icons/filterNotch';
import { iconFilterPeaking } from '../../../images/icons/filterPeaking';
import { iconSettings } from '../../../images/icons/settings';
import { Storage, StorageKey } from '../../../lib/Storage';
import { ConnectableEvents, ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { SElement } from '../../../types';
import { BaseNode } from '../BaseNode/BaseNode';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import styles from './filter.styles';
import { FilterSidebar } from './FilterSidebar/FilterSidebar';


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
export class Filter extends BaseNode {

  static get styles() {
    return [styles]
  }

  get type() { return this.filter.type; }
  set type(v: BiquadFilterType) { this.filter.type = v; }

  get frequency() { return this.filter.frequency.value; }
  set frequency(v: number) { this.filter.frequency.value = v }

  get q() { return this.filter.Q.value; }
  set q(v: number) { this.filter.Q.value = v }

  get gain() { return this.filter.gain.value; }
  set gain(v: number) { this.filter.gain.value = v }

  filter: BiquadFilterNode = this._ctx.createBiquadFilter();
  multipleConnections = false;
  output = this.filter;
  input = this.filter;


  private _sidebar: FilterSidebar | null = null;
  private _startConnect() { return true; }


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


  render() {
    // @ts-ignore
    const icon = icons[this.type];
    return html`
      <canvas width="120" height="120"></canvas>
      <div class="background"> ${iconFilter} </div>
      <div class="icon">${icon}</div>
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


const filter = mix(Filter, [
  DraggableMixin,
  SelectableMixin,
  DeletableMixin,
  ConnectableMixin,
  ReceivableMixin,
  HasCircleMenuMixin
])


window.customElements.define(SElement.filter, filter);
