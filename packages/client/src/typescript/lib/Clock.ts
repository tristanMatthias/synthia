import { State, Transport } from 'tone';
import { EventObject } from './EventObject/EventObject';
import Tone from 'tone';


export interface ClockEvents {
  play: void;
  pause: void;
  seek: number;
  stop: void;
}

export const Clock = new class extends EventObject<ClockEvents> {
  // @ts-ignore
  transport: Transport = Tone.Transport;

  public get playing(): boolean {
    return this.transport.state === State.Started;
  }
  public set playing(v: boolean) {
    if (this.playing === v) return;
    if (v) this.play();
    else this.pause();
  }

  public get tempo(): number {
    return this.transport.bpm.value;
  }
  public set tempo(v: number) {
    this.transport.bpm.value = v;
  }


  private _spaceDown = false;

  constructor() {
    super();
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  seek(time: number) {
    this.transport.seconds = time;
    this.emit('seek', time);
  }

  seekBeat(beat: number) {
    this.seek(beat / this.tempo * 60);
  }

  play() {
    this.transport.start();
    this.emit('play', undefined);
  }

  pause() {
    // @ts-ignore
    this.transport.pause();
    this.emit('pause', undefined);
  }

  stop() {
    this.transport.stop();
    this.emit('stop', undefined);
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  get currentTime() {
    return this.transport.seconds;
  }

  get currentBeat() {
    return Math.round((this.currentTime / 60) * this.tempo);
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
