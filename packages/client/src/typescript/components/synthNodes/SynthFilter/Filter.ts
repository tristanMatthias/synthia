import { ESynthiaProjectSynthNodeFilter } from '@synthia/api';
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
import { ConnectableEvents, ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { pxToRem } from '../../../lib/pxToRem';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import { SynthPageEvents } from '../../pages/synth/synth.page';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { BaseNode } from '../SynthBaseNode/BaseNode';
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
export class Filter extends BaseNode<ESynthiaProjectSynthNodeFilter> {

  static get styles() {
    return [styles]
  }

  protected _updateValues() {
    const m = this.model!;
    this.output.type = m.properties.type;
    this.output.Q.value = m.properties.q;
    this.output.frequency.value = m.properties.frequency;
    this.output.gain.value = m.properties.gain;
    this.requestUpdate();
  }

  filter: BiquadFilterNode = this._ctx.createBiquadFilter();
  multipleConnections = false;
  output = this.filter;
  input = this.filter;


  private _sidebar: FilterSidebar | null = null;
  private _startConnect() { return true; }


  get buttons(): CircleMenuButton[] {
    const action = (type: BiquadFilterType) => () => this.model!.properties.type = type;
    const t = this.model!.properties.type;

    return [
      { text: 'All Pass', icon: icons.allpass, action: action('allpass'), active: t == 'allpass' },
      { text: 'Band Pass', icon: icons.bandpass, action: action('bandpass'), active: t == 'bandpass' },
      { text: 'High Pass', icon: icons.highpass, action: action('highpass'), active: t == 'highpass' },
      { text: 'High Shelf', icon: icons.highshelf, action: action('highshelf'), active: t == 'highshelf' },
      { text: 'Low Pass', icon: icons.lowpass, action: action('lowpass'), active: t == 'lowpass' },
      { text: 'Low Shelf', icon: icons.lowshelf, action: action('lowshelf'), active: t == 'lowshelf' },
      { text: 'Notch', icon: icons.notch, action: action('notch'), active: t == 'notch' },
      { text: 'Peaking', icon: icons.peaking, action: action('peaking'), active: t == 'peaking' },
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
  }


  render() {
    // @ts-ignore
    const icon = icons[this.model!.properties.type];
    return html`
      <canvas width="12rem" height="12rem"></canvas>
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

  firstUpdated(props: Map<string, keyof Filter>) {
    super.firstUpdated(props);
    this._synth.addEventListener(SynthPageEvents.redraw, this._drawFrequencyArc.bind(this));
  }

  updated(props: Map<keyof Filter, any>) {
    super.updated(props);
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
      this._synth.appendChild(sidebar);
      this._sidebar = sidebar;

      if (!Storage.get(StorageKey.notifiedSidebarOpen)) {
        this._toaster.info('Pro tip: You can open the Filter settings by double clicking on the filter');
        Storage.set(StorageKey.notifiedSidebarOpen, true)
      }
    }
  }



  private _drawFrequencyArc() {
    const size = pxToRem(120);
    const ctx = this.shadowRoot!.querySelector('canvas')!.getContext('2d')!;
    const maxFreq = 24000;
    const lineWidth = pxToRem(6);
    let perc = this.model!.properties.frequency / maxFreq;
    perc = Math.log(perc) / Math.log(maxFreq);
    if (perc == -1) perc = -0.999999;

    // Prevent no drawing
    if (perc === 0) perc -= 0.001;


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
    ctx.globalAlpha = 1;
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