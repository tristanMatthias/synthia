import { ctx } from "./AudioContext";

export const Clock = new class {
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

  constructor() {
    this._handleKeyDown = this._handleKeyDown.bind(this);
    window.addEventListener('keydown', this._handleKeyDown);
  }

  seek(time: number) {
    this._stoppedAt = time;
    this._startedAtCtx = ctx.currentTime;
  }

  play() {
    this._playing = true;
    this._startedAtCtx = ctx.currentTime;
  }

  pause() {
    this._stoppedAt = this.currentTime;
    this._playing = false;
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

  get currentBar() {
    return Math.floor(this.currentBarExact);
  }

  get currentBarExact() {
    // TODO: Extra timing
    // 4/4 timing
    return this.currentBeat / 4;
  }


  private _handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space') {
      if (this.playing) this.pause();
      else this.play();
    }
  }
}
