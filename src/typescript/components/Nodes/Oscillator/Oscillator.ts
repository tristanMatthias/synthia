import { html, query } from 'lit-element';

import { iconConnect } from '../../../images/icons/connect';
import { iconOscillator } from '../../../images/icons/oscillator';
import { iconWaveSawtooth } from '../../../images/icons/waveSawtooth';
import { iconWaveSine } from '../../../images/icons/waveSine';
import { iconWaveSquare } from '../../../images/icons/waveSquare';
import { KeyboardEvent } from '../../../lib/Keyboard';
import { ConnectableEvents, ConnectableMixin } from '../../../lib/mixins/Connectable/Connectable';
import { DeletableMixin } from '../../../lib/mixins/Deletable/Deletable';
import { DraggableMixin } from '../../../lib/mixins/Draggable/Draggable';
import { HasCircleMenuMixin } from '../../../lib/mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../../lib/mixins/mix';
import { SelectableEvents, SelectableMixin } from '../../../lib/mixins/Selectable/Selectable';
import { SynthiaOscillator } from '../../../audioNodes/Oscillator';
import { SElement } from '../../../types';
import { BaseNode } from '../BaseNode/BaseNode';
import { CircleMenuButton } from '../../ui/CircleMenu/CircleMenu';
import { SidebarEvents } from '../../layout/Sidebar/Sidebar';
import styles from './oscillator.styles';
import { OscillatorSidebar } from './OscillatorSidebar/OscillatorSidebar';


const icons = {
  sine: iconWaveSine,
  sawtooth: iconWaveSawtooth,
  square: iconWaveSquare,
}

export class Oscillator extends BaseNode {

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
