import { Toaster } from "../components/ui/Toaster/Toaster";
import { keyToFrequency } from "./keyToFrequency";

export enum KeyboardEvent {
  play = 'keyboard-play',
  stop = 'keyboard-stop',
}


export class Keyboard {
  octave = 4;
  _pressed: Map<string, boolean> = new Map()

  constructor(
    public ctx: AudioContext,
    public toaster: Toaster
  ) {

    window.addEventListener('keypress', e => {
      const f = keyToFrequency(e.key, 4);
      if (f && !this._pressed.get(e.key)) {
        this._dispatch(KeyboardEvent.play, f);
        this._pressed.set(e.key, true)
      }
    });

    window.addEventListener('keyup', e => {
      const f = keyToFrequency(e.key, 4);
      if (f) {
        this._dispatch(KeyboardEvent.stop, f);
        this._pressed.delete(e.key);
      }
    });
  }


  private _dispatch(event: KeyboardEvent, freq: number) {
    window.dispatchEvent(new CustomEvent(event, {
      detail: freq
    }));
  }
}
