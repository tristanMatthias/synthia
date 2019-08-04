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
import { SynthiaKeyboardEvent, Keyboard } from '../../visualizations/Keyboard/Keyboard';
import { BaseNode } from '../BaseNode/BaseNode';
import styles from './wave.styles';
import { WaveSidebar } from './WaveSidebar/WaveSidebar';


const icons = {
  sine: iconWaveSine,
  sawtooth: iconWaveSawtooth,
  square: iconWaveSquare,
}

export class Wave extends BaseNode {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Connectable
  protected _startConnect() { }


  multipleConnections = true;
  output: SynthiaWave;

  private _sidebar: WaveSidebar | null = null;

  keyboard: Keyboard = document.querySelector(SElement.keyboard)!;


  get buttons(): CircleMenuButton[] {
    const action = (type: OscillatorType) => () => this.type = type;
    return [
      { text: 'Square wave', icon: icons.square, action: action('square'), active: this.type === 'square' },
      { text: 'Sine wave', icon: icons.sine, action: action('sine'), active: this.type === 'sine' },
      { text: 'Sawtooth wave', icon: icons.sawtooth, action: action('sawtooth'), active: this.type === 'sawtooth' },
      // @ts-ignore From Connectable
      { text: 'Connect', icon: iconConnect, action: () => this._startConnect(), color: 'text' },
    ]
  }


  @query('.background')
  background?: HTMLElement;


  constructor() {
    super();
    this._play = this._play.bind(this);
    this._stop = this._stop.bind(this);
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
    this.output = this._ctx.createSynthiaWave();
  }


  get type() { return this.output.type; }
  set type(v: OscillatorType) {
    this.output.type = v;
    this.requestUpdate();
  }


  render() {
    // @ts-ignore
    const icon = icons[this.type];
    return html`
      <div class="background"> ${iconWave} </div>
      <div class="icon">${icon}</div>
    `;
  }

  firstUpdated(props: Map<string, keyof Wave>) {
    super.firstUpdated(props);
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
    this.keyboard!.addEventListener(SynthiaKeyboardEvent.play, this._play);
    this.keyboard!.addEventListener(SynthiaKeyboardEvent.stop, this._stop);
    window.addEventListener('blur', this._stop);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.keyboard!.removeEventListener(SynthiaKeyboardEvent.play, this._play);
    this.keyboard!.removeEventListener(SynthiaKeyboardEvent.stop, this._stop);
    window.removeEventListener('blur', this._stop);
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
      this._app.appendChild(sidebar);
      this._sidebar = sidebar;
    }
  }


  private _play(e: CustomEventInit) {
    this.output.play(e.detail)
  }
  private _stop(e: CustomEventInit) {
    this.output.stop(e.detail)
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