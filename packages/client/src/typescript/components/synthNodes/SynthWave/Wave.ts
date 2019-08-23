import { ESynthiaProjectSynthNodeWave } from '@synthia/api';
import { html, query } from 'lit-element';

import { SynthiaWave } from '../../../audioNodes/Wave';
import { iconConnect } from '../../../images/icons/connect';
import { iconWave } from '../../../images/icons/wave';
import { iconWaveSawtooth } from '../../../images/icons/waveSawtooth';
import { iconWaveSine } from '../../../images/icons/waveSine';
import { iconWaveSquare } from '../../../images/icons/waveSquare';
import { ConnectableEvents, ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { SElement } from '../../../types';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { BaseNode } from '../SynthBaseNode/BaseNode';
import styles from './wave.styles';
import { WaveSidebar } from './WaveSidebar/WaveSidebar';


const icons = {
  sine: iconWaveSine,
  sawtooth: iconWaveSawtooth,
  square: iconWaveSquare,
}

export class Wave extends BaseNode<ESynthiaProjectSynthNodeWave, SynthiaWave> {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Connectable
  protected _startConnect() { }


  multipleConnections = true;
  audioNode: SynthiaWave;

  private _sidebar: WaveSidebar | null = null;

  get buttons(): CircleMenuButton[] {
    if (!this.synthNode) return [];
    const action = (type: OscillatorType) => () => this.synthNode!.properties.type = type;
    return [
      { text: 'Square wave', icon: icons.square, action: action('square'), active: this.synthNode!.properties.type === 'square' },
      { text: 'Sine wave', icon: icons.sine, action: action('sine'), active: this.synthNode!.properties.type === 'sine' },
      { text: 'Sawtooth wave', icon: icons.sawtooth, action: action('sawtooth'), active: this.synthNode!.properties.type === 'sawtooth' },
      // @ts-ignore From Connectable
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
    ]
  }


  @query('.background')
  background?: HTMLElement;


  protected _updateValues() {
    const m = this.synthNode!;
    this.audioNode.type = m.properties.type;
    this.audioNode.delay = m.properties.delay;
    this.audioNode.attack = m.properties.attack;
    this.audioNode.attackLevel = m.properties.attackLevel;
    this.audioNode.decay = m.properties.decay;
    this.audioNode.decayLevel = m.properties.decayLevel;
    this.audioNode.release = m.properties.release;
    this.audioNode.pitch = m.properties.pitch;
    this.audioNode.gain = m.properties.gain;
    this.requestUpdate();
  }

  constructor() {
    super();
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
    this.audioNode = this._ctx.createSynthiaWave();
  }

  render() {
    if (!this.synthNode) return html``;
    // @ts-ignore
    const icon = icons[this.synthNode.properties.type];
    return html`
      <div class="background"> ${iconWave} </div>
      <div class="icon">${icon}</div>
    `;
  }

  firstUpdated(props: Map<string, keyof Wave>) {
    super.firstUpdated(props);
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.toggleSidebar(true);
  }


  toggleSidebar(forceRemove?: boolean) {
    if (this._sidebar || forceRemove) {
      if (this._sidebar) this._sidebar.remove();
      this._sidebar = null;
    } else {
      const sidebar = new WaveSidebar();
      sidebar.wave = this;
      sidebar.addEventListener(SidebarEvents.closed, () => {
        this.toggleSidebar(true);
      });
      this._synth.appendChild(sidebar);
      this._sidebar = sidebar;
    }
  }
}


window.customElements.define(
  SElement.wave,
  mix(Wave, [
    DraggableMixin,
    SelectableMixin,
    DeletableMixin,
    ConnectableMixin,
    HasCircleMenuMixin
  ])
);

declare global {
  interface HTMLElementTagNameMap {
    [SElement.wave]: Wave;
  }
}
