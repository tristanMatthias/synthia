import CompositeAudioNode from "./BaseNode";
import { Envelope } from "./Envelope";


interface WaveOptions {
  type?: OscillatorType;
  gain?: number;
}


export class SynthiaWave extends CompositeAudioNode {

  private _type: OscillatorType = 'sine';
  get type() {
    return this._type;
  }
  set type(v: OscillatorType) {
    this._type = v;
    this._notes.forEach(([, o]) => {
      o.type = v;
    })
    this._setEnvGainOnType();
  }

  private _pitch: number = 0;
  get pitch() {
    return this._pitch;
  }
  set pitch(v: number) {
    this._pitch = v;

    Array.from(this._notes.entries())
      .forEach(([freq, [env, o]]) => {
        const tuned = this._tuned(freq);
        o.frequency.setValueAtTime(tuned, this._ctx.currentTime);
      })
  }

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


  private _notes: Map<number, [Envelope, OscillatorNode]> = new Map();
  private _comp: DynamicsCompressorNode;


  constructor(
    protected _ctx: AudioContext | OfflineAudioContext,
    options?: WaveOptions
  ) {
    super(_ctx);
    const defaults: WaveOptions = {
      type: 'sine',
      gain: 1,
      ...options
    }
    this.type = defaults.type!;
    // this._output.gain.value = 2;

    this._comp = this._ctx.createDynamicsCompressor();
    this._comp.threshold.value = -32;
    this._comp.knee.value = 40;
    this._comp.ratio.value = 20;
    this._comp.attack.value = 0;
    this._comp.release.value = 1;
    this._comp.connect(this._output);

    this._input.connect(this._comp);
  }


  private _tuned(freq: number) {
    return Math.floor(freq * Math.pow(2, this.pitch / 12));
  }


  play(freq: number, duration?: number) {

    const tuned = this._tuned(freq);

    // If already playing, stop it, then restart it
    const existing = this._notes.get(freq);
    if (existing) {
      const e = existing[0];
      // Prevent clicking
      e.gain.cancelAndHoldAtTime(this._ctx.currentTime);
      e.gain.linearRampToValueAtTime(0, this._ctx.currentTime + 0.01)
      e.onend = undefined;
    }

    const osc = this._ctx.createOscillator();
    osc.type = this.type;
    osc.frequency.setValueAtTime(tuned, this._ctx.currentTime);


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
    env.connect(this._input);

    this._notes.set(freq, [env, osc]);
    this._setEnvGainOnType();
    osc.start();


    return osc;
  }


  stop(freq?: number, when: number = 0) {
    // Stop all frequencies if none supplied
    if (freq === undefined) {
      Array.from(this._notes.keys()).forEach(f => this.stop(f));
      return;
    }

    const tuned = this._tuned(freq);

    const envOsc = this._notes.get(freq);
    // Note is not playing
    if (!envOsc) return false;
    envOsc[0].startRelease();
    console.log('starting release of', freq);

  }

  kill(freq: number) {
    const tuned = this._tuned(freq);
    const envOsc = this._notes.get(freq);
    // Note is not playing
    if (!envOsc) return false;

    envOsc[1].stop(this._ctx.currentTime);
    this._notes.delete(freq);
  }

  private _setEnvGainOnType() {
    Array.from(this._notes.values()).forEach(([env]) => {
      let gain;
      if (this.type === 'sine') gain = 1;
      else if (this.type === 'sawtooth') gain = 0.32;
      else if (this.type === 'square') gain = 0.4;
      else gain = 1;
      env.gain.setValueAtTime(gain, this._ctx.currentTime);
    })
  }
}


declare global {
  interface AudioContext {
    createSynthiaWave(options?: WaveOptions): SynthiaWave
  }
  interface OfflineAudioContext {
    createSynthiaWave(options?: WaveOptions): SynthiaWave
  }
}




// Inject the new class into AudioContext prototype.
AudioContext.prototype.createSynthiaWave =
  OfflineAudioContext.prototype.createSynthiaWave = function (options: WaveOptions) {
    return new SynthiaWave(this as AudioContext | OfflineAudioContext, options);
  };
