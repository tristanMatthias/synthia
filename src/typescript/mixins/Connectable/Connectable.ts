import { LitElement, html, TemplateResult } from 'lit-element';
import { Receivable, ReceivableEvents } from '../Receivable/Receivable';
import { Waveform } from '../../components/Waveform/Waveform';
import { SElement } from '../../types';
import { Position, DraggableEvents } from '../Draggable/Draggable';


export enum ConnectableEvents {
  newConnection = 'new-connection',
  connectingRotate = 'connecting-rotate'
}

export interface Connectable {
  connectTo(item: Receivable): boolean;
  output?: AudioNode;

  multipleConnections: boolean;
}


export const ConnectableMixin = (superclass: new () => LitElement) =>
  class Connectable extends superclass implements Connectable {

    // From superclass
    playing?: boolean;
    selected?: boolean;


    multipleConnections?: boolean;
    output?: AudioNode;

    private _app = document.querySelector(SElement.app)!;

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
      this._updateWaveforms = this._updateWaveforms.bind(this)
    }


    render() {
      let waveforms;
      // If there are multiple connections, don't create any waveforms initially
      if (this.multipleConnections) {
        waveforms = this._connectedTo.map(() =>
          html`<synthia-waveform></synthia-waveform>`
        );
      } else {
        // Otherwise, if there is only one connection allowed, there will always
        // only be one waveform, so always create it
        const hideBeforeConnected = this._connectedTo.length ? '' : 'display: none';
        waveforms = html`<synthia-waveform style=${hideBeforeConnected}></synthia-waveform>`;
      }

      let connecting: TemplateResult | null = null;
      if (this._connecting && this._mousePos) {
        connecting = html`<synthia-waveform class="connecting"></synthia-waveform>`
      }


      const root = super.render();
      return html`${root}${waveforms}${connecting}`;
    }


    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('keydown', this._connectableKeyDown);
      this._startConnect();
    }

    disconnectedCallback() {
      if (this.output) this._connectedTo.forEach(this.disconnectFrom.bind(this));
      window.removeEventListener('keydown', this._connectableKeyDown);
      super.disconnectedCallback();
    }


    async connectTo(item: Receivable) {
      if (!this.multipleConnections && this._connectedTo.length) return false;

      if (!this._connectedTo.includes(item)) {
        this._connectedTo.push(item);
        await this.requestUpdate();
        const wf = this.shadowRoot!.querySelector(
          `${SElement.waveform}:nth-of-type(${this._connectedTo.length})`
        ) as Waveform;

        if (!item.connect(wf.analyser)) return false;

        this.dispatchEvent(new CustomEvent(ConnectableEvents.newConnection, {
          detail: wf
        }));

        item.addEventListener(DraggableEvents.dragged, this._updateWaveforms);
        item.addEventListener(ReceivableEvents.removed, () => this.disconnectFrom(item))
        return true;
      }


      if (this._connecting) this._connecting = false;
    }


    async disconnectFrom(item: Receivable) {
      const index = this._connectedTo.indexOf(item);
      if (index < 0) return false;
      if (this.output) item.disconnect(this.output);
      this._connectedTo.splice(index, 1);
      this.requestUpdate();
    }


    protected _startConnect() {
      this._connecting = true;
      this._app.isConnecting = true;
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
      this._app.isConnecting = false;
      await this.requestUpdate();
      window.removeEventListener('mousemove', this._updateConnect);
      window.removeEventListener('click', this._endConnect);

      if (!e || !e.target) return;
      const receivable = e.target as Receivable;

      // @ts-ignore
      if (!receivable.canReceive || receivable === this) return false;
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
