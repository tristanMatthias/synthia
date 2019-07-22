import { LitElement, html } from 'lit-element';
import { Receivable } from '../Receivable/Receivable';
import { Waveform } from '../../components/Waveform/Waveform';
import { SElement } from '../../types';
import { Position } from '../Draggable/Draggable';


export enum ConnectableEvents {
  newConnection = 'new-connection',
  connectingRotate = 'connecting-rotate'
}

export interface Connectable {
  connectTo(item: Receivable): void;
}


export const ConnectableMixin = (superclass: new () => LitElement) =>
  class Connectable extends superclass {

    // From superclass
    playing?: boolean;
    selected?: boolean;

    get waveform() {
      return this.shadowRoot!.querySelector(SElement.waveform)!;
    }

    private _connectedTo: Receivable[] = [];
    private _connecting: boolean = false;
    private _mousePos: Position | null = null;

    constructor() {
      super();

      this._updateConnect = this._updateConnect.bind(this);
      this._endConnect = this._endConnect.bind(this);
      this._connectableKeyDown = this._connectableKeyDown.bind(this)
    }


    render() {
      const playingClass = this.playing ? 'playing' : '';
      const waveforms = this._connectedTo.map(() =>
        html`<synthia-waveform class=${playingClass}></synthia-waveform>`
      );

      if (this._connecting && this._mousePos) waveforms.push(
        html`<synthia-waveform class="connecting"></synthia-waveform>`
      );


      const root = super.render();
      return html`${root}${waveforms}`;
    }


    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('keydown', this._connectableKeyDown);
      this._startConnect();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('keydown', this._connectableKeyDown);
    }


    async connectTo(item: Receivable) {

      if (!this._connectedTo.includes(item)) {
        this._connectedTo.push(item);
        await this.requestUpdate();
        const wf = this.shadowRoot!.querySelector(
          `${SElement.waveform}:nth-of-type(${this._connectedTo.length})`
        ) as Waveform;

        item.connect(wf.analyser);

        this.dispatchEvent(new CustomEvent(ConnectableEvents.newConnection, {
          detail: wf
        }));
      }


      if (this._connecting) this._connecting = false;
    }


    protected _startConnect() {
      this._connecting = true;
      this._mousePos = null;
      window.addEventListener('mousemove', this._updateConnect);
      setTimeout(() => {
        window.addEventListener('click', this._endConnect);
      }, 100);
    }


    private _updateConnect(e: MouseEvent) {
      this._mousePos = { x: e.clientX, y: e.clientY }
      this._updateWaveforms();
    }


    private async _endConnect(e?: MouseEvent) {
      this._connecting = false;
      await this.requestUpdate();
      window.removeEventListener('mousemove', this._updateConnect);
      window.removeEventListener('click', this._endConnect);

      if (!e || !e.target) return;
      // @ts-ignore
      const receivable = e.target as Receivable;
      if (!receivable.canReceive) return false;
      this.connectTo(receivable);
    }


    updated(changed: any) {
      super.updated(changed);
      if (this._connectedTo.length || this._connecting) this._updateWaveforms();
    }


    private _updateWaveforms() {
      const thisBox = this.getBoundingClientRect() as DOMRect;
      const thisX = thisBox.x + thisBox.width / 2;
      const thisY = thisBox.y + thisBox.height / 2;

      if (this._connecting && this._mousePos) {
        this._updateWaveform(
          this.shadowRoot!.querySelector(`${SElement.waveform}.connecting`) as Waveform,
          thisX, thisY, this._mousePos!.x, this._mousePos!.y,
          this._connectedTo.length == 0
        )

      } else {
        const waveforms = this.shadowRoot!.querySelectorAll(SElement.waveform);
        this._connectedTo.forEach((dest, i) => {
          let destX: number;
          let destY: number;

          const connectedBox = dest.getBoundingClientRect() as DOMRect;
          destX = connectedBox.x + connectedBox.width / 2;
          destY = connectedBox.y + connectedBox.height / 2;

          this._updateWaveform(waveforms[i], thisX, thisY, destX, destY, i == 0);
        })
      }
    }


    private _updateWaveform(
      wf: Waveform,
      x: number,
      y: number,
      destX: number,
      destY: number,
      dispatch: boolean = false
    ) {
      if (!wf) return;
      const angleRad = Math.atan((y - destY) / (x - destX));
      let angleDeg = angleRad * 180 / Math.PI;

      let distance = Math.sqrt(((x - destX) ** 2) + ((y - destY) ** 2));
      if (!this._connecting) distance -= 120;
      else distance -= 60;

      if (x >= destX) angleDeg += 180;

      if (distance < 0) distance = 0;


      wf.style.transform = `translateY(-50%) rotate(${angleDeg}deg) translateX(60px)`
      wf.width = distance;

      if (dispatch) {
        this.dispatchEvent(new CustomEvent(ConnectableEvents.connectingRotate, {
          detail: { distance, angle: angleDeg }
        }))
      }
    }


    private _connectableKeyDown(e: KeyboardEvent) {
      if (this._connecting && e.code == 'Escape') this._endConnect();
    }
  }
