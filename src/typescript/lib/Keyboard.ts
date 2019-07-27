import { Toaster } from "../components/Toaster/Toaster";
import { keyToFrequency } from "./keyToFrequency";

export enum KeyboardEvent {
  play = 'keyboard-play',
  stop = 'keyboard-stop',
}


export class Keyboard {
  octave = 4;

  constructor(
    public ctx: AudioContext,
    public toaster: Toaster
  ) {

    window.addEventListener('keydown', e => {
      const f = keyToFrequency(e.key, 4);
      if (f) this._dispatch(KeyboardEvent.play, f);
    });

    window.addEventListener('keyup', e => {
      const f = keyToFrequency(e.key, 4);
      console.log('stopping', f);

      if (f) this._dispatch(KeyboardEvent.stop, f);
    });
  }


  private _dispatch(event: KeyboardEvent, freq: number) {
    window.dispatchEvent(new CustomEvent(event, {
      detail: freq
    }));
  }
}
