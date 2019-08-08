import CompositeAudioNode from "./BaseNode";

interface DelayOptions {
  delayTime: number
  dryWet: number
  feedback: number
}

export class SynthiaDelay extends CompositeAudioNode {

  private _delay: DelayNode;

  get delayTime() { return this._delay.delayTime; }
  get feedback() { return this._feedback.gain; }

  private _feedback: GainNode;

  _dryGain = this._ctx.createGain();
  get dry() {
    return this._dryGain.gain;
  }

  _wetGain = this._ctx.createGain();
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
    options?: DelayOptions
  ) {
    super(_ctx);

    const defaults: DelayOptions = {
      delayTime: 0.5,
      dryWet: 0.5,
      feedback: 0.7,
      ...options
    }

    this._delay = _ctx.createDelay(30);
    this._feedback = _ctx.createGain();
    this._feedback.gain.value = defaults.feedback;
    this.dryWet = defaults.dryWet;

    this._delay.connect(this._feedback);
    this._feedback.connect(this._wetGain);
    this._feedback.connect(this._input);

    this._input.connect(this._dryGain);
    this._input.connect(this._delay);

    this._dryGain.connect(this._output);
    this._wetGain.connect(this._output);
  }
}
