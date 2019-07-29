import CompositeAudioNode from "./BaseNode";
import { Envelope } from "./Envelope";


interface OscillatorOptions {
  type?: OscillatorType;
  gain?: number;
}


export class SynthiaOscillator extends CompositeAudioNode {

  type: OscillatorType;

  private _notes: Map<number, [Envelope, OscillatorNode]> = new Map();



  private _delay: number = 0;
  get delay() { return this._delay; }
  set delay(v: number) { this._delay = v; }

  private _attack: number = 0.3;
  get attack() { return this._attack; }
  set attack(v: number) { this._attack = v; }

  private _attackLevel: number = 0.7;
  get attackLevel() { return this._attackLevel; }
  set attackLevel(v: number) { this._attackLevel = v; }

  private _decay: number = 1;
  get decay() { return this._decay; }
  set decay(v: number) { this._decay = v; }

  private _decayLevel: number = 0.5;
  get decayLevel() { return this._decayLevel; }
  set decayLevel(v: number) { this._decayLevel = v; }

  private _release: number = 0.5;
  get release() { return this._release; }
  set release(v: number) { this._release = v; }


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

    // Already playing
    if (this._notes.get(freq)) return false;
    const osc = this._ctx.createOscillator();
    osc.type = this.type;
    osc.frequency.setValueAtTime(freq, this._ctx.currentTime);

    console.log(this.attack);


    const env = new Envelope(this._ctx, {
      delay: this.delay,
      attack: this.attack,
      attackLevel: this.attackLevel,
      decay: this.decay,
      decayLevel: this.decayLevel,
      release: this.release,
    }, duration);

    env.onend = () => this.kill(freq);

    // @ts-ignore
    osc.connect(env as AudioNode);
    env.connect(this._output)

    this._notes.set(freq, [env, osc]);
    osc.start();

    return osc;
  }


  stop(freq: number, when: number = 0) {
    const envOsc = this._notes.get(freq);
    // Note is not playing
    if (!envOsc) return false;
    envOsc[0].startRelease();
  }

  kill(freq: number) {
    const envOsc = this._notes.get(freq);
    // Note is not playing
    if (!envOsc) return false;

    envOsc[1].stop(this._ctx.currentTime);
    this._notes.delete(freq);
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
