import { customElement, html, LitElement, property } from 'lit-element';

import { NodeSynth } from '../../../../lib/Instruments/Synth/NodeSynth';
import { Selectable } from '../../../../lib/mixins/Selectable/Selectable';
import { project } from '../../../../lib/Project/Project';
import { remToPx } from '../../../../lib/pxToRem';
import { Storage, StorageKey } from '../../../../lib/Storage';
import { SElement } from '../../../../types';
import { Canvas } from '../../../layout/Canvas/Canvas';
import { Toaster } from '../../../ui/Toaster/Toaster';
import { connectComponentNode, createComponentNode } from './createComponentNode';
import styles from './synth-page.styles';
import { Master } from 'tone';
import { Waveform } from '../../../visualizations/Waveform/Waveform';



export enum SynthPageEvents {
  connecting = 'connecting',
  redraw = 'redraw'
}



@customElement(SElement.synthPage)
export class PageSynth extends LitElement {

  static get styles() {
    return [styles]
  }
  private _selected: Selectable[] = [];

  @property()
  isDragging: boolean = false;

  private _toaster: Toaster;
  private _canvas?: Canvas;
  private _clearing = false;
  // Redraw all elements on change
  private _globalFontSize = parseInt(getComputedStyle(document.documentElement).fontSize || '10px')


  synthId?: string;
  synth: NodeSynth;


  private _isConnecting: boolean = false;
  public get isConnecting(): boolean {
    return this._isConnecting;
  }
  public set isConnecting(v: boolean) {
    this._isConnecting = v;
    (Array.from(this.querySelectorAll(`${SElement.canvas} > *`)) as HTMLElement[])
      // @ts-ignore
      .filter(e => !e.canReceive && !e._connecting)
      .forEach(e => e.style.opacity = v ? '0.2' : '1')

    this.requestUpdate();
  }


  connectedCallback() {
    super.connectedCallback();
    project.on('loadedNewProject', () => {
      this.synth = project.instruments[this.synthId!] as NodeSynth;
      this._generateNodesFromFile();
    });

    this.synth = project.instruments[this.synthId!] as NodeSynth;
  }

  render() {
    return html`
    <slot></slot>
    <div class="corners">
      <svg xmlns="http://www.w3.org/2000/svg" width="${remToPx(7)}" height="${remToPx(4)}" viewbox="0 0 70 40" class="corner-top-left">
        <path fill="none" fill-rule="evenodd" stroke="var(--color-main)" stroke-linecap="square" d="M69.454 1H41L1 41" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${remToPx(7)}" height="${remToPx(4)}" viewbox="0 0 70 40" class="corner-bottom-left">
        <path fill="none" fill-rule="evenodd" stroke="var(--color-main)" stroke-linecap="square" d="M69.454 1H41L1 41" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${remToPx(7)}" height="${remToPx(4)}" viewbox="0 0 70 40" class="corner-top-right">
        <path fill="none" fill-rule="evenodd" stroke="var(--color-main)" stroke-linecap="square" d="M69.454 1H41L1 41" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${remToPx(7)}" height="${remToPx(4)}" viewbox="0 0 70 40" class="corner-bottom-right">
        <path fill="none" fill-rule="evenodd" stroke="var(--color-main)" stroke-linecap="square" d="M69.454 1H41L1 41" />
      </svg>
    </div>`;
  }


  select(element: Selectable, multiple = false) {
    if (multiple) {
      if (!this._selected.includes(element)) {
        this._selected.push(element);
        element.selected = true;
      }
    } else {
      this._selected.forEach(e => e.selected = false);
      this._selected = [element];
      element.selected = true;
    }
  }


  deselect(element?: Selectable) {
    if (!element) {
      this._selected.forEach(e => e.selected = false);
      this._selected = [];
    } else {
      const index = this._selected.indexOf(element);
      if (index > -1) this._selected.splice(index, 1);
      element.selected = false;
    }
  }

  removeNode(node: HTMLElement) {
    if (this._clearing || !project.file || !this.synthId) return false;
    const synth = project.file.resources.synths.find(s => s.id === this.synthId)!;
    synth.nodes = synth.nodes.filter(n => n.id !== node.id);
    return true;
  }

  async firstUpdated() {
    this._toaster = document.querySelector(SElement.toaster)!;
    this._canvas = document.createElement(SElement.canvas);

    const root = document.createElement(SElement.root);
    root.id = 'root';
    this._canvas.appendChild(root);
    this.prepend(this._canvas);

    if (this.synth) this._generateNodesFromFile();

    window.addEventListener('resize', () => {
      const newFS = parseInt(getComputedStyle(document.documentElement).fontSize || '10px');
      if (newFS !== this._globalFontSize) {
        this._globalFontSize = newFS;
        this.dispatchEvent(new CustomEvent(SynthPageEvents.redraw));
        this.requestUpdate()
      }
    });

    if (!Storage.get(StorageKey.notifiedIntro)) {
      this._toaster.info('Welcome to Synthia! Find your sound by dragging a node onto the canvas');
      Storage.set(StorageKey.notifiedIntro, true)
    }

    Master.chain(
      (document.querySelector(`${SElement.waveform}.main`!) as Waveform).analyser!
    );
  }

  private _generateNodesFromFile() {
    if (!this.synth) return false;


    this._clearing = true;
    this._canvas!.clear();
    this._clearing = false;

    const eles = Object.values(this.synth.nodes).map(([sn, an]) => {
      const ele = createComponentNode(sn, an, true);
      this._canvas!.appendChild(ele);
      return ele;
    });


    (eles).forEach(connectComponentNode);
    this.isConnecting = false;

    return true;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.synthPage]: PageSynth;
  }
}
