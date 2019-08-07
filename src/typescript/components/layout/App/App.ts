import { customElement, html, LitElement, property } from 'lit-element';

import { AudioCtx } from '../../../lib/AudioContext';
import { SynthiaFile } from '../../../lib/File/file.type';
import { FileService } from '../../../lib/File/FileService';
import { Selectable } from '../../../lib/mixins/Selectable/Selectable';
import { Model, ModelEvents } from '../../../lib/Model/Model';
import { remToPx } from '../../../lib/pxToRem';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { Canvas } from '../Canvas/Canvas';
import styles from './app.styles';
import { connectNode, createNode } from './createNode';

export enum AppEvents {
  connecting = 'connecting',
  redraw = 'redraw'
}

@customElement(SElement.app)
export class App extends LitElement {

  static get styles() {
    return [styles]
  }

  context = new AudioCtx();
  mainWaveform = document.querySelector(SElement.waveform)!;

  private _selected: Selectable[] = [];

  @property()
  isDragging: boolean = false;

  private readonly _toaster = document.querySelector(SElement.toaster)!;
  private _canvas?: Canvas;
  // Redraw all elements on change
  private _globalFontSize = parseInt(getComputedStyle(document.documentElement).fontSize || '10px')


  fileService = new FileService();
  model: Model;
  synthId: string;



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
    this.fileService.on('loaded', this._generateNodesFromFile.bind(this));
    this.model = new Model(this.fileService.file);
    this.model.on('update', this._handleModelUpdate);
    // TODO: Dynamic synth selection
    this.synthId = this.model.file.resources.synths[0].id;
  }

  connectedCallback() {
    super.connectedCallback();
    this._canvas = document.createElement(SElement.canvas);
    this._canvas.model = this.model;
    this._canvas.synthId = this.synthId;

    const root = document.createElement(SElement.root);
    root.id = 'root';
    this._canvas.appendChild(root);
    this.prepend(this._canvas);

    window.addEventListener('resize', () => {
      const newFS = parseInt(getComputedStyle(document.documentElement).fontSize || '10px');
      if (newFS !== this._globalFontSize) {
        this._globalFontSize = newFS;
        this.dispatchEvent(new CustomEvent(AppEvents.redraw));
        this.requestUpdate()
      }
    })
  }

  render() { return html`
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
    </div>
  `; }


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

  firstUpdated() {
    if (!Storage.get(StorageKey.notifiedIntro)) {
      this._toaster.info('Welcome to Synthia! Find your sound by dragging a node onto the canvas');
      Storage.set(StorageKey.notifiedIntro, true)
    }
    this._generateNodesFromFile(this.fileService.file);
  }


  private _generateNodesFromFile(file: SynthiaFile) {
    this._canvas!.clear();

    this.model.loadNewFile(file);

    // TODO: Select multiple synths
    const synth = this.model.file.resources.synths[0];
    const nodes = synth.nodes;
    // @ts-ignore
    nodes.forEach(n => this._canvas.appendChild(createNode(n)))
    nodes.forEach(connectNode);
    this.isConnecting = false;
  }


  private _handleModelUpdate(e: ModelEvents['update']) {
    // console.log(e);
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.app]: App;
  }
}
