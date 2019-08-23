import { ESynthiaProjectSynthNodeFilter } from '@synthia/api';
import { html, query } from 'lit-element';
import { filter as filterIcon } from '../../../images/icons';
import { ConnectableEvents, ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { ReceivableMixin } from '../../../lib/mixins/Receivable/Receivable';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { remToPx } from '../../../lib/pxToRem';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import { SynthPageEvents } from '../../pages/project/synth/synth.page';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { BaseEffectClass } from '../SynthBaseEffect/BaseEffect';
import { BaseNode } from '../SynthBaseNode/BaseNode';
import { FilterSidebar } from './FilterSidebar/FilterSidebar';


export class Filter extends BaseNode<ESynthiaProjectSynthNodeFilter, BiquadFilterNode> {

  static get styles() {
    return [BaseEffectClass.styles]
  }

  protected _updateValues() {
    const m = this._synthNode!;
    this.audioNode.type = m.properties.type;
    this.audioNode.Q.value = m.properties.q;
    this.audioNode.frequency.value = m.properties.frequency;
    this.audioNode.gain.value = m.properties.gain;
    this.requestUpdate();
  }

  multipleConnections = false;

  private _sidebar: FilterSidebar | null = null;
  private _startConnect() { return true; }


  get buttons(): CircleMenuButton[] {
    const action = (type: BiquadFilterType) => () => this.synthNode!.properties.type = type;
    const t = this.synthNode!.properties.type;

    return [
      { text: 'All Pass', icon: 'filterAllpass', action: action('allpass'), active: t == 'allpass' },
      { text: 'Band Pass', icon: 'filterBandpass', action: action('bandpass'), active: t == 'bandpass' },
      { text: 'High Pass', icon: 'filterHighpass', action: action('highpass'), active: t == 'highpass' },
      { text: 'High Shelf', icon: 'filterHighshelf', action: action('highshelf'), active: t == 'highshelf' },
      { text: 'Low Pass', icon: 'filterLowpass', action: action('lowpass'), active: t == 'lowpass' },
      { text: 'Low Shelf', icon: 'filterLowshelf', action: action('lowshelf'), active: t == 'lowshelf' },
      { text: 'Notch', icon: 'filterNotch', action: action('notch'), active: t == 'notch' },
      { text: 'Peaking', icon: 'filterPeaking', action: action('peaking'), active: t == 'peaking' },
      { text: 'Connect', icon: 'connect', action: () => this._startConnect(), color: 'text' },
      { text: 'Settings', icon: 'settings', action: () => this.toggleSidebar(), color: 'text' }
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
    const t = this.synthNode!.properties.type;
    const icon = t.slice(0, 1).toUpperCase() + t.slice(1);
    return html`
      <canvas width="${remToPx(12)}px" height="${remToPx(12)}px"></canvas>
      <div class="background"> ${filterIcon} </div>
      <s-icon type = "filter${icon}" > </s-icon>
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
    const size = remToPx(12);
    const ctx = this.shadowRoot!.querySelector('canvas')!.getContext('2d')!;
    const maxFreq = 24000;
    const lineWidth = 6;
    let perc = this.synthNode!.properties.frequency / maxFreq;
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
