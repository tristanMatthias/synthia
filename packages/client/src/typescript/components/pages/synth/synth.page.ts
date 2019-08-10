import { customElement, html, LitElement, property } from 'lit-element';

import { ctx } from '../../../lib/AudioContext';
import { Selectable } from '../../../lib/mixins/Selectable/Selectable';
import { remToPx } from '../../../lib/pxToRem';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { AppEvents } from '../../App/App';
import { Canvas } from '../../layout/Canvas/Canvas';
import { connectNode, createNode } from './createNode';
import styles from './synth-page.styles';
import { model } from '../../../lib/Model/Model';


export enum SynthPageEvents {
  connecting = 'connecting',
  redraw = 'redraw'
}



@customElement(SElement.synthPage)
export class PageSynth extends LitElement {

  static get styles() {
    return [styles]
  }

  context = ctx;
  input = this.context.createGain();

  private _selected: Selectable[] = [];

  @property()
  isDragging: boolean = false;

  private readonly _app = document.querySelector(SElement.app)!;
  private readonly _toaster = document.querySelector(SElement.toaster)!;
  private _canvas?: Canvas;
  private _clearing = false;
  // Redraw all elements on change
  private _globalFontSize = parseInt(getComputedStyle(document.documentElement).fontSize || '10px')


  synthId?: string;


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


  constructor() {
    super();
    // TODO: Dynamic synth selection
    this.input.connect(this.context.destination);
  }

  connectedCallback() {
    super.connectedCallback();
    this._canvas = document.createElement(SElement.canvas);

    const root = document.createElement(SElement.root);
    root.id = 'root';
    this._canvas.appendChild(root);
    this.prepend(this._canvas);

    this._app.addEventListener(AppEvents.loadProject, this._loadProject.bind(this));
    if (this._app.model.file) this._loadProject();

    window.addEventListener('resize', () => {
      const newFS = parseInt(getComputedStyle(document.documentElement).fontSize || '10px');
      if (newFS !== this._globalFontSize) {
        this._globalFontSize = newFS;
        this.dispatchEvent(new CustomEvent(SynthPageEvents.redraw));
        this.requestUpdate()
      }
    });
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
    if (this._clearing || !model.file || !this.synthId) return false;
    const synth = model.file.resources.synths.find(s => s.id === this.synthId)!;
    synth.nodes = synth.nodes.filter(n => n.id !== node.id);
    return true;
  }

  firstUpdated() {
    if (!Storage.get(StorageKey.notifiedIntro)) {
      this._toaster.info('Welcome to Synthia! Find your sound by dragging a node onto the canvas');
      Storage.set(StorageKey.notifiedIntro, true)
    }
  }

  private async _loadProject() {
    await this._generateNodesFromFile();
  }

  private _generateNodesFromFile() {
    if (!model.file) return false;
    this._clearing = true;
    this._canvas!.clear();
    this._clearing = false;

    // TODO: Select multiple synths
    const synth = model.file.resources.synths[0];
    this.synthId = synth.id;
    const nodes = synth.nodes;

    // @ts-ignore
    nodes.forEach(n => this._canvas.appendChild(createNode(n)))
    nodes.forEach(connectNode);
    this.isConnecting = false;

    return true;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.synthPage]: PageSynth;
  }
}
