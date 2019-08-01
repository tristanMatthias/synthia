import CompositeAudioNode from '../../audioNodes/BaseNode';
import { mergeParams } from '../mergeParams';
import { LowPassCombFilter } from '../../audioNodes/LowPassCombFilter';

// Freeverb params defined by Mr. Shroeder
// const SAMPLE_RATE = 44100;
const COMB_FILTER_TUNINGS = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116];
const ALLPASS_FREQUENCIES = [225, 556, 441, 341];


const createAP = (ctx: AudioContext | OfflineAudioContext, freq: number) => {
  const allPass = ctx.createBiquadFilter();
  allPass.type = 'allpass';
  allPass.frequency.value = freq;
  return allPass;
};


interface ReverbOptions {
  roomSize: number,
  wetGain: number,
  dryGain: number,
  dampening: number
}


export default class Reverb extends CompositeAudioNode {
  private _combFilters: LowPassCombFilter[];

  private _wet: GainNode;
  get wetGain() {
    return this._wet.gain;
  }

  private _dry: GainNode;
  get dryGain() {
    return this._dry.gain;
  }

  get roomSize() {
    return mergeParams(this._combFilters.map(comb => comb.resonance));
  }

  get dampening() {
    return mergeParams(this._combFilters.map(comb => comb.dampening));
  }

  constructor(ctx: AudioContext | OfflineAudioContext, options: ReverbOptions) {
    super(ctx);
    const { roomSize: resonance, dampening, wetGain, dryGain } = options;

    this._wet = ctx.createGain();
    this._wet.gain.setValueAtTime(wetGain, ctx.currentTime);

    this._dry = ctx.createGain();
    this._dry.gain.setValueAtTime(dryGain, ctx.currentTime);

    this._combFilters = COMB_FILTER_TUNINGS
      .map(delayPerSecond => delayPerSecond / ctx.sampleRate)
      .map(delayTime => new LowPassCombFilter(ctx, { dampening, resonance, delayTime }))
    // @ts-ignore
    // this._combFilters.forEach(cf => this._input.connect(cf));
    // this._combFilters.forEach(cf => cf.connect(this._output))
    // const cf = new LowPassCombFilter(ctx, {
    //     delayTime: 0.2,
    //     resonance: 0.5,
    //     dampening: 500
    // });
    // // @ts-ignore
    // this._input.connect(cf);
    // cf.connect(this._output);

    const merger = ctx.createChannelMerger(2);
    const splitter = ctx.createChannelSplitter(2);
    const combLeft = this._combFilters.slice(0, 4);
    const combRight = this._combFilters.slice(4);
    // const allPassFilters = ALLPASS_FREQUENCIES.map(freq => createAP(ctx, freq));

    // //connect all nodes
    this._input.connect(this._wet).connect(splitter);
    // this._input.connect(this._dry).connect(this._output);

    combLeft.forEach(comb => {
      // @ts-ignore
      splitter.connect(comb, 0).connect(merger, 0, 0);
    });
    combRight.forEach(comb => {
      // @ts-ignore
      splitter.connect(comb, 1).connect(merger, 0, 1);
    });

    merger
    //   .connect(allPassFilters[0])
    //   .connect(allPassFilters[1])
    //   .connect(allPassFilters[2])
    //   .connect(allPassFilters[3])
      .connect(this._output);
  }
}



declare global {
  interface AudioContext {
    createFreeverb(options: ReverbOptions): Reverb
  }
  interface OfflineAudioContext {
    createFreeverb(options: ReverbOptions): Reverb
  }
}


// Inject the new class into AudioContext prototype.
AudioContext.prototype.createFreeverb =
  OfflineAudioContext.prototype.createFreeverb = function (options: ReverbOptions) {
    return new Reverb(this as AudioContext | OfflineAudioContext, options);
  };
