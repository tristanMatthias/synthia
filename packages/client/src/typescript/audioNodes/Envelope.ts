import { ctx } from '../lib/AudioContext';

export interface EnvelopeOptions {
  delay: number;
  attack: number,
  attackLevel: number,
  decay: number,
  decayLevel: number,
  release: number,
  maxPercentage: number
}

interface Timings {
  attackStart: number,
  decayStart: number,
  decayEnd: number,
  releaseStart?: number,
  end?: number
}

const ZERO = 0.00000001;

export class Envelope {

  param: AudioParam;

  private _started = ctx.currentTime;
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
    this._attackLevel = v * this._maxPercentage;
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
    this._decayLevel = v * this._maxPercentage;
    this._update();
  }

  private _release: number = 0.2;
  get release() { return this._release }
  set release(v: number) {
    this._release = v;
    this._update();
  }
  private _maxPercentage: number = 1;


  constructor(
    param: AudioParam,
    options?: Partial<EnvelopeOptions>,
    private _duration?: number
  ) {

    const settings: EnvelopeOptions = {
      delay: 0,
      attack: 0.3,
      attackLevel: 1,
      decay: 1,
      decayLevel: 0.7,
      release: 0.2,
      maxPercentage: 1,
      ...options
    }
    this.param = param;


    // Set to 0 initially
    param.setValueAtTime(ZERO, ctx.currentTime);

    this._maxPercentage = settings.maxPercentage;
    this._delay = settings.delay;
    this._attack = settings.attack;
    this._attackLevel = settings.attackLevel * this._maxPercentage;
    this._decay = settings.decay;
    this._decayLevel = settings.decayLevel * this._maxPercentage;
    this._release = settings.release;

    this._update();
    this._timer();
  }


  startRelease(time = this.release) {
    this._ending = true;
    // Hack around jumping sounds
    const initial = this.param.value;
    this.param.cancelAndHoldAtTime(ctx.currentTime);
    this.param.setValueAtTime(initial, ctx.currentTime);
    this.param.linearRampToValueAtTime(ZERO, ctx.currentTime + time);
  }


  rampToZero() {
    this.param.cancelScheduledValues(ctx.currentTime);
    this.param.linearRampToValueAtTime(0, ctx.currentTime + 0.01);
  }


  private _props(): EnvelopeOptions {
    const { delay, attack, attackLevel, decay, decayLevel, release, _maxPercentage } = this;
    return { delay, attack, attackLevel, decay, decayLevel, release, maxPercentage: _maxPercentage }
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

    const t = ctx.currentTime;
    const p = this.param;
    const props = this._props();
    const newTimes = this._times(props);

    p.cancelScheduledValues(t);

    // const newIncludesAttack
    p.setValueAtTime(ZERO, newTimes.attackStart);
    p.linearRampToValueAtTime(this.attackLevel, newTimes.decayStart);
    p.exponentialRampToValueAtTime(props.decayLevel, newTimes.decayEnd);

    if (newTimes.releaseStart && newTimes.end) {
      // Hold the decay level until release
      p.linearRampToValueAtTime(props.decayLevel, newTimes.releaseStart);
      p.linearRampToValueAtTime(ZERO, newTimes.end);
    }
  }


  private _timer() {
    // If at the end of the release
    if (!this._ending && this._duration && (ctx.currentTime >= this._started + this._duration)) {
      this.startRelease();
    }

    if (
      // If manually ending...
      (this._ending && this.param.value <= ZERO)
      // this._duration && (ctx.currentTime >= this._started + this._duration + this._release)
    ) {
      if (this.onend) this.onend();
    } else {
      window.requestAnimationFrame(() => this._timer());
    }
  }
}
