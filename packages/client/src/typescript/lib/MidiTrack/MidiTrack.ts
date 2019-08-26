import { Clock } from '../Clock';
import { Instrument } from '../Instruments/Instrument';
import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';


export class MidiTrack {
  constructor(
    public notes: EMidiClipNote[],
    public instrument: Instrument
  ) {
    this._update();
  }

  private _current: EMidiClipNote[] = [];


  play(note: EMidiClipNote) {
    if (this._current.includes(note)) return false;
    this._current.push(note);
    const n = note.n;
    this.instrument.triggerAttack([n]);
    return n;
  }

  triggerRelease(note: EMidiClipNote) {
    if (!this._current.includes(note)) return false;
    const n = note.n;
    this.instrument.triggerRelease([n]);
    this._current.splice(this._current.indexOf(note), 1)
    return true;
  }


  private _update() {
    const t = Clock.currentBeat;
    const fidelity = 0.05;

    this.notes.forEach(n => {
      const end = Math.abs(n.s + n.d) - t;
      if (Math.abs(n.s - t) < fidelity) this.play(n);
      else if (end < fidelity) this.triggerRelease(n);
    });

    requestAnimationFrame(this._update.bind(this));
  }


}
