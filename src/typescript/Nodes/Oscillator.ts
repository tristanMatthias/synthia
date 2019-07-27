import CompositeAudioNode from "./BaseNode";


interface OscillatorOptions {
  type?: OscillatorType;
  gain?: number;
}


export class SynthiaOscillator extends CompositeAudioNode {

  type: OscillatorType;

  private _notes: Map<number, OscillatorNode> = new Map();

  constructor(
    protected _ctx: AudioContext | OfflineAudioContext,
    options?: OscillatorOptions
  ) {
    super(_ctx);
    const defaults: OscillatorOptions = {
      type: 'sine',
      gain: 1,
      ...options
    }
    this.type = defaults.type!;
    this._output.gain.value = 1;
  }


  play(freq: number, duration?: number) {
    console.log(freq);


    // Already playing
    if (this._notes.get(freq)) return false;
    const osc = this._ctx.createOscillator();
    osc.type = this.type;
    osc.frequency.setValueAtTime(freq, this._ctx.currentTime);
    osc.connect(this._output);

    osc.onended = () => this._notes.delete(freq);

    if (duration) osc.stop(this._ctx.currentTime + duration);

    this._notes.set(freq, osc);
    osc.start();

    return osc;
  }


  stop(freq: number, when: number = 0) {
    const osc = this._notes.get(freq);

    // Note is not playing
    if (!osc) return false;
    console.log(osc);


    osc.stop(this._ctx.currentTime + when);
  }
}


declare global {
  interface AudioContext {
    createSynthiaOscillator(options?: OscillatorOptions): SynthiaOscillator
  }
  interface OfflineAudioContext {
    createSynthiaOscillator(options?: OscillatorOptions): SynthiaOscillator
  }
}

console.log('before');



// Inject the new class into AudioContext prototype.
AudioContext.prototype.createSynthiaOscillator =
  OfflineAudioContext.prototype.createSynthiaOscillator = function (options: OscillatorOptions) {
    return new SynthiaOscillator(this as AudioContext | OfflineAudioContext, options);
  };
