import { Player, Transport } from "tone";
import toneA from '../../sounds/metronome/metronome-a.wav';
import toneB from '../../sounds/metronome/metronome-b.wav';
import { Clock } from "./Clock";

export const Metronome = new class {
  toneA = new Player(toneA).toMaster();
  toneB = new Player(toneB).toMaster();

  on: boolean;

  constructor() {
    Transport.scheduleRepeat(() => {
      if (this.on) {
        if (Clock.currentBarBeat === 0) this.toneA.start();
        else this.toneB.start();
      }
    }, "4n");
  }
}
