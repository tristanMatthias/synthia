import CompositeAudioNode from "./BaseNode";

interface LowPassCombFilterOptions {
  delayTime: number
  resonance: number
  dampening: number
}


export class LowPassCombFilter extends CompositeAudioNode {
  private _gain: GainNode;
  private _delay: DelayNode;
  private _lp: BiquadFilterNode;

  get resonance() {
    return this._gain.gain;
  }

  get dampening() {
    return this._lp.frequency;
  }

  get delayTime() {
    return this._delay.delayTime;
  }

  constructor(
    protected _ctx: AudioContext | OfflineAudioContext,
    options: LowPassCombFilterOptions
  ) {
    super(_ctx);
    const { delayTime, resonance: gainValue, dampening: frequency } = options;

    this._lp = new BiquadFilterNode(this._ctx, { type: 'lowpass', frequency });
    this._delay = new DelayNode(this._ctx, { delayTime });
    this._gain = this._ctx.createGain();
    this._gain.gain.setValueAtTime(gainValue, this._ctx.currentTime);


    this._input
      .connect(this._delay)
      .connect(this._lp)
      .connect(this._gain)
      .connect(this._output);

    this._input.connect(this._output)
  }
}

declare global {
  interface AudioContext {
    createLowPassCombFilter(options: LowPassCombFilterOptions): LowPassCombFilter
  }
  interface OfflineAudioContext {
    createLowPassCombFilter(options: LowPassCombFilterOptions): LowPassCombFilter
  }
}


// Inject the new class into AudioContext prototype.
AudioContext.prototype.createLowPassCombFilter =
OfflineAudioContext.prototype.createLowPassCombFilter = function (options: LowPassCombFilterOptions) {
  return new LowPassCombFilter(this as AudioContext | OfflineAudioContext, options);
};
