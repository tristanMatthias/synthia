import { html, query } from 'lit-element';

import { iconConnect } from '../../icons/connect';
import { iconOscillator } from '../../icons/oscillator';
import { iconWaveSawtooth } from '../../icons/waveSawtooth';
import { iconWaveSine } from '../../icons/waveSine';
import { iconWaveSquare } from '../../icons/waveSquare';
import { KeyboardEvent } from '../../lib/Keyboard';
import { ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { SelectableEvents, SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SynthiaOscillator } from '../../Nodes';
import { SElement } from '../../types';
import { BaseComponent } from '../BaseComponent/BaseComponent';
import { CircleMenuButton } from '../CircleMenu/CircleMenu';
import { SidebarEvents } from '../Sidebar/Sidebar';
import styles from './oscillator.styles';
import { OscillatorSidebar } from './OscillatorSidebar/OscillatorSidebar';


const icons = {
  sine: iconWaveSine,
  sawtooth: iconWaveSawtooth,
  square: iconWaveSquare,
}

export class Oscillator extends BaseComponent {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Connectable
  protected _startConnect() { }


  multipleConnections = true;
  output: SynthiaOscillator;

  private _sidebar: OscillatorSidebar | null = null;


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
    this.output = this._ctx.createSynthiaOscillator();
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
      <div class="background"> ${iconOscillator} </div>
      <div class="icon">${icon}</div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dblclick', () => this.toggleSidebar());
    this.addEventListener(SelectableEvents.deselected, () => this.toggleSidebar(true));
    window.addEventListener(KeyboardEvent.play, this._play);
    window.addEventListener(KeyboardEvent.stop, this._stop);
    window.addEventListener('blur', this._stop);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(KeyboardEvent.play, this._play);
    window.removeEventListener(KeyboardEvent.stop, this._stop);
    window.removeEventListener('blur', this._stop);
    this.toggleSidebar(true);
  }


  toggleSidebar(forceRemove?: boolean) {
    if (this._sidebar || forceRemove) {
      if (this._sidebar) this._sidebar.remove();
      this._sidebar = null;
    } else {
      const sidebar = new OscillatorSidebar();
      sidebar.oscillator = this;
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
