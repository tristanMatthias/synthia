import { EventObject } from './EventObject/EventObject';
import { keyToNote } from './keyToFrequency';

export interface KeyboardEvents {
  attack: string;
  release: string;
}

export const Keyboard = new class extends EventObject<KeyboardEvents> {
  octave = 4;
  _pressed: Map<string, boolean> = new Map();

  constructor(
  ) {
    super();
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);

    window.addEventListener('keypress', this._handleKeyPress);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  private _handleKeyPress(e: KeyboardEvent) {
    const n = keyToNote(e.key, this.octave);
    if (n) this._play(n.note + n.octave);
  }

  private _handleKeyUp(e: KeyboardEvent) {
    const n = keyToNote(e.key, this.octave);
    if (n) this._stop(n.note + n.octave);
  }

  private _play(n: string) {
    if (n && !this._pressed.get(n)) {
      this._pressed.set(n, true);
      this.emit('attack', n);
    }
  }
  private _stop(n: string) {
    this._pressed.delete(n);
    this.emit('release', n);
  }
}
