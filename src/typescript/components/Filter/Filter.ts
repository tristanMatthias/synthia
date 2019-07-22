import { html, LitElement, query, queryAll } from 'lit-element';

import { connect } from '../../icons/connect';
import { filter } from '../../icons/filter';
import { filterHighPass } from '../../icons/filterHighPass';
import { filterLowPass } from '../../icons/filterLowPass';
import { Connectable, ConnectableEvents, ConnectableMixin } from '../../mixins/Connectable/Connectable';
import { DeletableMixin } from '../../mixins/Deletable/Deletable';
import { DraggableMixin } from '../../mixins/Draggable/Draggable';
import { CircleMenuButton, HasCircleMenu, HasCircleMenuMixin } from '../../mixins/HasCircleMenu/HasCircleMenu';
import { mix } from '../../mixins/mix';
import { ReceivableMixin } from '../../mixins/Receivable/Receivable';
import { SelectableMixin } from '../../mixins/Selectable/Selectable';
import { SElement } from '../../types';
import { Waveform } from '../Waveform/Waveform';
import styles from './filter.styles';


const icons = {
  lowpass: filterLowPass,
  highpass: filterHighPass
}

export class Filter extends LitElement implements Connectable, HasCircleMenu {

  static get styles() {
    return [styles]
  }

  // ---------------------------------------------------------- Mixin properties
  // Selectable
  selected?: boolean;
  connectTo(): void { }
  // Connectable
  protected _startConnect() { }
  // Circle menu
  private _menuOpen: boolean = false;




  private _app = document.querySelector(SElement.app)!;
  ctx = this._app.context

  filter: BiquadFilterNode = this.ctx.createBiquadFilter();


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


  get buttons() {
    const buttons: CircleMenuButton[] = Object.entries(icons).map(([type, icon], i) => {
      let t = type as BiquadFilterType;
      return {
        icon,
        action: () => this.type = t
      };
    })

    buttons.push({ action: this._startConnect, icon: connect });

    return buttons;
  }


  @queryAll(SElement.waveform)
  waveforms?: Waveform[];

  @query('.background')
  background?: HTMLElement;


  constructor() {
    super();
    this.addEventListener(ConnectableEvents.connectingRotate, (e: CustomEventInit) => {
      this.background!.style.transform = `rotate(${e.detail.angle + 90}deg)`
    });
    this.filter.type = 'allpass';
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



  connect(node: AudioNode) {
    node.connect(this.filter);
    this.filter.connect(this.waveforms![0].analyser)
  }


  render() {
    return html`
      <div class="background"> ${filter} </div>
      <div class="icon">${this.icon}</div>
    `;
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
