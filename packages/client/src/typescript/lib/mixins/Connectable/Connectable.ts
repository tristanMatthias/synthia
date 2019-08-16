import { html, LitElement, TemplateResult } from 'lit-element';

import { Waveform } from '../../../components/visualizations/Waveform/Waveform';
import { SElement } from '../../../types';
import { pxToRem, remToPx } from '../../pxToRem';
import { DraggableEvents, Position } from '../Draggable/Draggable';
import { Receivable, ReceivableEvents } from '../Receivable/Receivable';
import { SynthPageEvents } from '../../../components/pages/project/synth/synth.page';
import { model } from '../../Model/Model';


export enum ConnectableEvents {
  newConnection = 'new-connection',
  connectingRotate = 'connecting-rotate'
}

export interface Connectable {
  connectTo(item: Receivable): Promise<boolean>;
  disconnectFrom(item: Receivable): Promise<boolean>;
  multipleConnections?: boolean;
}


export const ConnectableMixin = (superclass: new () => LitElement) =>
  class Connectable extends superclass implements Connectable {

    // @ts-ignore Defined in superclass
    output: AudioNode;

    multipleConnections?: boolean;

    private _synth = document.querySelector(SElement.synthPage)!;
    private _toaster = document.querySelector(SElement.toaster)!;

    private _connectedTo: Receivable[] = [];
    private _connecting: boolean = false;
    private _mousePos: Position | null = null;

    constructor() {
      super();

      this._updateConnect = this._updateConnect.bind(this);
      this._endConnect = this._endConnect.bind(this);
      this._connectableKeyDown = this._connectableKeyDown.bind(this)
      this._updateWaveforms = this._updateWaveforms.bind(this);
    }


    render() {
      let waveforms;
      // If there are multiple connections, don't create any waveforms initially
      if (this.multipleConnections) {
        waveforms = this._connectedTo.map(() =>
          html`<synthia-waveform removable></synthia-waveform>`
        );
      } else {
        // Otherwise, if there is only one connection allowed, there will always
        // only be one waveform, so always create it
        const hideBeforeConnected = this._connectedTo.length ? '' : 'display: none';
        waveforms = html`<synthia-waveform removable style=${hideBeforeConnected}></synthia-waveform>`;
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
      this._synth.addEventListener(SynthPageEvents.redraw, this._updateWaveforms);
      this._startConnect();
    }

    disconnectedCallback() {
      if (this.output) {
        this._connectedTo.forEach(this.disconnectFrom.bind(this));
        this.output.disconnect();
      }
      window.removeEventListener('keydown', this._connectableKeyDown);
      super.disconnectedCallback();
    }


    async connectTo(item: Receivable) {
      if (!this.multipleConnections && this._connectedTo.length) return false;

      if (!this._connectedTo.includes(item)) {
        this._connectedTo.push(item);
        // @ts-ignore
        this.model.connectedTo = this._connectedTo.map(ele => ele.id);

        // Wait for the new waveform to exist
        await this.requestUpdate();

        const wf = this.shadowRoot!.querySelector(
          `${SElement.waveform}:nth-of-type(${this._connectedTo.length})`
        ) as Waveform;

        this.output.connect(wf.input!);
        this.output.connect(item.input as AudioNode);

        wf.connectedTo = item;
        wf.connectedFrom = this as Connectable;

        this.dispatchEvent(new CustomEvent(ConnectableEvents.newConnection, {
          detail: wf
        }));
        model.save();

        item.addEventListener(DraggableEvents.dragged, this._updateWaveforms);
        item.addEventListener(ReceivableEvents.removed, () => this.disconnectFrom(item))
      }


      if (this._connecting) this._connecting = false;
      return true;
    }


    async disconnectFrom(item: Receivable) {
      const index = this._connectedTo.indexOf(item);
      if (index < 0) return false;
      if (this.output) item.disconnect(this.output);
      this._connectedTo.splice(index, 1);
      // @ts-ignore
      this.model!.connectedTo = this._connectedTo.map(ele => ele.id).filter(id => id !== item.id);
      this.requestUpdate();
      model.save();
      return true;
    }


    protected _startConnect() {
      this._connecting = true;
      this._synth.isConnecting = true;
      this._mousePos = null;
      window.addEventListener('mousemove', this._updateConnect);
      window.addEventListener('mousedown', this._endConnect);
    }


    private _updateConnect(e: MouseEvent) {
      this._mousePos = { x: e.clientX, y: e.clientY }
      if (!this.shadowRoot!.querySelector('synthia-waveform.connecting')) {
        this.requestUpdate();
      }
      this._updateWaveforms();

    }


    private async _endConnect(e?: MouseEvent) {
      if (e) e.stopPropagation();

      this._connecting = false;
      this._synth.isConnecting = false;
      await this.requestUpdate();
      window.removeEventListener('mousemove', this._updateConnect);
      window.removeEventListener('mousedown', this._endConnect);

      if (!e || !e.target) return;
      const receivable = e.target as Receivable;


      // @ts-ignore
      if (!receivable.canReceive || receivable === this) {
        if (receivable.tagName.toLowerCase() != SElement.canvas) {
          this._toaster.error('Cannot connect to this type of node');
        }
        return false;
      }
      this.connectTo(receivable);

      // @ts-ignore
      this._synth.select(this);
      return true;
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
      if (!this._connecting) distance -= remToPx(12);
      else distance -= remToPx(6);

      if (x >= destX) angleDeg += 180;
      if (distance < 0) distance = 0;


      wf.style.transform = `translateY(-50%) rotate(${angleDeg}deg) translateX(6rem)`;
      wf.width = pxToRem(distance);

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
