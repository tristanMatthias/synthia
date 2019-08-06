import { customElement, html, LitElement, property } from 'lit-element';

import { SynthiaFile } from '../../../lib/File/file.type';
import { FileService } from '../../../lib/File/FileService';
import { Selectable } from '../../../lib/mixins/Selectable/Selectable';
import { Model, ModelEvents } from '../../../lib/Model/Model';
import { Storage, StorageKey } from '../../../lib/Storage';
import { SElement } from '../../../types';
import { Canvas } from '../Canvas/Canvas';
import { connectNode, createNode } from './createNode';

export enum AppEvents {
  connecting = 'connecting'
}

@customElement(SElement.app)
export class App extends LitElement {

  context = new AudioContext();
  mainWaveform = document.querySelector(SElement.waveform)!;

  private _selected: Selectable[] = [];

  @property()
  isDragging: boolean = false;

  private _toaster = document.querySelector(SElement.toaster)!;
  private _canvas?: Canvas;


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
  }

  render() { return html`<slot></slot>`; }


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
