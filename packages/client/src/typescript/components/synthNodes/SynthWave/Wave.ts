import { ESynthiaProjectSynthNodeWave } from '@synthia/api';
import { html, query } from 'lit-element';
import { BasicOscillatorType, PolySynth } from 'tone';

import { wave } from '../../../images/icons';
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

export class Wave extends BaseNode<ESynthiaProjectSynthNodeWave, PolySynth> {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Connectable
  protected _startConnect() { }


  multipleConnections = true;
  audioNode: PolySynth;

  private _sidebar: WaveSidebar | null = null;

  get buttons(): CircleMenuButton[] {
    if (!this.synthNode) return [];
    const action = (type: BasicOscillatorType) => () => this.synthNode!.properties.type = type;
    return [
      { text: 'Square wave', icon: 'waveSquare', action: action('square'), active: this.synthNode!.properties.type === 'square' },
      { text: 'Sine wave', icon: 'waveSine', action: action('sine'), active: this.synthNode!.properties.type === 'sine' },
      { text: 'Sawtooth wave', icon: 'waveSawtooth', action: action('sawtooth'), active: this.synthNode!.properties.type === 'sawtooth' },
      // @ts-ignore From Connectable
      { text: 'Connect', icon: 'connect', action: () => this._startConnect(), color: 'text' },
    ]
  }


  @query('.background')
  background?: HTMLElement;


  protected _updateValues() {
    const m = this.synthNode!;
    this.audioNode.set({
      oscillator: {
        type: m.properties.type,
      },
      envelope: {
        attack: m.properties.attack,
        decay: m.properties.decay,
        release: m.properties.release,
      }
    })
    // this.audioNode.pitch = m.properties.pitch;
    this.requestUpdate();
  }

  constructor() {
    super();
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
  }

  render() {
    if (!this.synthNode) return html``;
    const t = this.synthNode.properties.type;
    const icon = t.slice(0, 1).toUpperCase() + t.slice(1);
    return html`
      <div class="background"> ${wave} </div>
      <s-icon type="wave${icon}"></s-icon>
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
