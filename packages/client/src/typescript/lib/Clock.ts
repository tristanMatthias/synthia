import { ctx } from "./AudioContext";
import { EventObject } from "./EventObject/EventObject";

export interface ClockEvents {
  play: void;
  pause: void;
  seek: number;
  stop: void;
}

export const Clock = new class extends EventObject<ClockEvents> {
  private _playing: boolean = false;
  public get playing(): boolean {
    return this._playing;
  }
  public set playing(v: boolean) {
    if (v === this._playing) return;
    this._playing = v;
    if (v) this.play();
    else this.pause();
  }

  tempo: number = 140;

  private _startedAtCtx: number;
  private _stoppedAt: number = 0;
  private _spaceDown = false;

  constructor() {
    super();
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  seek(time: number) {
    this._stoppedAt = time;
    this._startedAtCtx = ctx.currentTime;
    this.emit('seek', time);
  }

  seekBeat(beat: number) {
    this.seek(beat / this.tempo * 60);
  }

  play() {
    this._playing = true;
    this._startedAtCtx = ctx.currentTime;
    this.emit('play', undefined);
  }

  pause() {
    this._stoppedAt = this.currentTime;
    this._playing = false;
    this.emit('pause', undefined);
  }

  stop() {
    this._playing = false;
    this.seek(0);
    this.emit('stop', undefined);
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  get currentTime() {
    if (!this._startedAtCtx) return 0;
    if (!this._playing) return this._stoppedAt;
    return (ctx.currentTime - this._startedAtCtx) + this._stoppedAt;
  }

  get currentBeat() {
    if (!this._startedAtCtx) return 0;
    return (this.currentTime / 60) * this.tempo;
  }

  get currentBarBeat() {
    return Math.floor(this.currentBeat % 4)
  }

  get currentBar() {
    return Math.floor(this.currentBarExact);
  }

  get currentBarExact() {
    // TODO: Extra timing
    // 4/4 timing
    return this.currentBeat / 4;
  }


  private _handleKeyPress(e: KeyboardEvent) {
    if (e.code === 'Space' && !this._spaceDown) {
      this._spaceDown = true;
      this.toggle();
    }
  }

  private _handleKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space') this._spaceDown = false;
  }
}
