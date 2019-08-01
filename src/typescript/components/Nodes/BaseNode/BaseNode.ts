import { LitElement } from "lit-element";
import { SElement } from "../../../types";
import CompositeAudioNode from "../../../audioNodes/BaseNode";

export class BaseNode extends LitElement {

  protected _app = document.querySelector(SElement.app)!;
  protected _ctx = this._app.context
  protected _toaster = document.querySelector(SElement.toaster)!;

  input: AudioNode | CompositeAudioNode = this._ctx.createGain();
  output: AudioNode | CompositeAudioNode = this._ctx.createGain();


}
