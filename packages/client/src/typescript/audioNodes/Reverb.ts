import CompositeAudioNode from "./BaseNode";
import { generateImpulseResponse } from "../lib/generateImpulseResponse";
import { AudioCtx, OfflineAudioCtx } from "../lib/AudioContext";

interface ReverbOptions {
  wetGain?: number,
  dryGain?: number,
  decayTime?: number
  fadeInTime?: number
  roomSize?: number
}


export class SynthiaReverb extends CompositeAudioNode {


  private _decayTime: number;
  get decayTime() { return this._decayTime; }
  set decayTime(v: number) {
    const past = this._decayTime;
    this._decayTime = v;
    if (past !== v) this._getImpulseResponse();
  }

  private _fadeInTime: number;
  get fadeInTime() { return this._fadeInTime; }
  set fadeInTime(v: number) {
    const past = this._fadeInTime;
    this._fadeInTime = v;
    if (past !== v) this._getImpulseResponse();
  }

  private _roomSize: number;
  get roomSize() { return this._roomSize; }
  set roomSize(v: number) {
    const past = this._roomSize;
    this._roomSize = v;
    if (past !== v) this._getImpulseResponse();
  }

  _convolver = this._ctx.createConvolver();
  _dryGain = this._ctx.createGain();
  _wetGain = this._ctx.createGain();


  get buffer() { return this._convolver.buffer; }
  set buffer(b: AudioBuffer | null) { this._convolver.buffer = b; }


  get dry() {
    return this._dryGain.gain;
  }
  get wet() {
    return this._wetGain.gain;
  }

  set dryWet(wetDbLevel: number) {
    let v = wetDbLevel;
    if (wetDbLevel < 0) v = 0;
    if (wetDbLevel > 1) v = 1;

    this.dry.value = 1 - v;
    this.wet.value = v;
  }


  constructor(
    protected _ctx: AudioContext | OfflineAudioContext,
    options?: ReverbOptions
  ) {
    super(_ctx);

    const settings: ReverbOptions = {
      wetGain: 0.5,
      dryGain: 0.5,
      decayTime: 3,
      fadeInTime: 0.1,
      roomSize: 150000,
      ...options,
    };
    this._input.gain.value = 0.5;
    this._input.connect(this._dryGain);
    this._input.connect(this._convolver);

    this._decayTime = settings.decayTime!;
    this._fadeInTime = settings.fadeInTime!;
    this._roomSize = settings.roomSize!;

    this._dryGain.gain.value = settings.dryGain!;
    this._wetGain.gain.value = settings.wetGain!;

    this._convolver.connect(this._wetGain);
    this._dryGain.connect(this._output);
    this._wetGain.connect(this._output);

    this._getImpulseResponse();
  }


  loadCustomImpulseResponse(url: string) {
    return fetch(url)
      .then(r => r.arrayBuffer())
      .then(this._ctx.decodeAudioData.bind(this._ctx))
      .then(ab => this.buffer = ab);
  }


  async _getImpulseResponse() {
    this.buffer = await generateImpulseResponse(this._ctx, {
      decayTime: this.decayTime,
      fadeInTime: this.fadeInTime,
      roomSize: this.roomSize,
      lpFreqEnd: 0,
    })
  }
}


declare global {
  interface AudioContext {
    createReverb(options?: ReverbOptions): SynthiaReverb
  }
  interface OfflineAudioContext {
    createReverb(options?: ReverbOptions): SynthiaReverb
  }
}


// Inject the new class into AudioContext prototype.
AudioCtx.prototype.createReverb =
  OfflineAudioCtx.prototype.createReverb = function (options: ReverbOptions) {
    return new SynthiaReverb(this as AudioContext | OfflineAudioContext, options);
  };
