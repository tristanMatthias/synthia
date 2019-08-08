import CompositeAudioNode from './BaseNode';

export interface EnvelopeOptions {
  delay: number;
  attack: number,
  attackLevel: number,
  decay: number,
  decayLevel: number,
  release: number
}

interface Timings {
  attackStart: number,
  decayStart: number,
  decayEnd: number,
  releaseStart?: number,
  end?: number
}

const ZERO = 0.00000001;

export class Envelope extends CompositeAudioNode {
  private _started = this._ctx.currentTime;
  private _envelopeGain = this._ctx.createGain();
  private _ending = false;


  onend?: () => void;



  private _delay: number = 0;
  get delay() { return this._delay }
  set delay(v: number) {
    this._delay = v;
    this._update();
  }

  private _attack: number = 0.3;
  get attack() { return this._attack }
  set attack(v: number) {
    this._attack = v;
    this._update();
  }

  private _attackLevel: number = 1;
  get attackLevel() { return this._attackLevel }
  set attackLevel(v: number) {
    this._attackLevel = v;
    this._update();
  }

  private _decay: number = 1;
  get decay() { return this._decay }
  set decay(v: number) {
    this._decay = v;
    this._update();
  }

  private _decayLevel: number = 0.7;
  get decayLevel() { return this._decayLevel }
  set decayLevel(v: number) {
    this._decayLevel = v;
    this._update();
  }

  private _release: number = 0.2;
  get release() { return this._release }
  set release(v: number) {
    this._release = v;
    this._update();
  }


  constructor(
    ctx: AudioContext | OfflineAudioContext,
    options?: Partial<EnvelopeOptions>,
    private _duration?: number
  ) {
    super(ctx);


    const settings: EnvelopeOptions = {
      delay: 0,
      attack: 0.3,
      attackLevel: 1,
      decay: 1,
      decayLevel: 0.7,
      release: 0.2,
      ...options
    }

    const g = this._envelopeGain.gain;


    this._input.connect(this._envelopeGain);
    this._envelopeGain.connect(this._output);

    // Set to 0 initially
    g.setValueAtTime(ZERO, ctx.currentTime);

    this._delay = settings.delay;
    this._attack = settings.attack;
    this._attackLevel = settings.attackLevel;
    this._decay = settings.decay;
    this._decayLevel = settings.decayLevel;
    this._release = settings.release;

    this._update();
    this._timer();

  }


  startRelease(time = this.release) {
    this._ending = true;
    this._envelopeGain.gain.cancelScheduledValues(this._ctx.currentTime);
    this._envelopeGain.gain.linearRampToValueAtTime(ZERO, this._ctx.currentTime + time);
  }


  private _props(): EnvelopeOptions {
    const { delay, attack, attackLevel, decay, decayLevel, release } = this;
    return { delay, attack, attackLevel, decay, decayLevel, release }
  }


  private _times(props: EnvelopeOptions): Timings {
    const attackStart = this._started + props.delay;
    const decayStart = attackStart + props.attack;
    const decayEnd = decayStart + props.decay;
    let releaseStart;
    let end;

    if (this._duration) {
      // Gate
      releaseStart = this._duration;
      end = this._duration + props.release;
    }

    return { attackStart, decayStart, decayEnd, releaseStart, end };
  }


  private _update() {
    const t = this._ctx.currentTime;
    const g = this._envelopeGain.gain;
    const props = this._props();
    const newTimes = this._times(props);

    g.cancelScheduledValues(t);


    // const newIncludesAttack
    g.setValueAtTime(ZERO, newTimes.attackStart);
    g.linearRampToValueAtTime(this.attackLevel, newTimes.decayStart);
    g.exponentialRampToValueAtTime(props.decayLevel, newTimes.decayEnd);

    if (newTimes.releaseStart && newTimes.end) {
      // Hold the decay level until release
      g.linearRampToValueAtTime(props.decayLevel, newTimes.releaseStart);
      g.linearRampToValueAtTime(ZERO, newTimes.end);
    }
  }


  private _timer() {
    // If at the end of the release
    if (!this._ending && this._duration && (this._ctx.currentTime >= this._started + this._duration)) {
      this.startRelease();
    }

    if (
      // If manually ending...
      (this._ending && this._envelopeGain.gain.value <= ZERO)
      // this._duration && (this._ctx.currentTime >= this._started + this._duration + this._release)
    ) {
      if (this.onend) this.onend();
    } else {
      window.requestAnimationFrame(() => this._timer());
    }
  }
}
