import { Clock } from '../Clock';
import { Instrument } from '../Instruments/Instrument';
import { MidiNote } from './MIDINote';


export class MidiTrack {
  constructor(
    public notes: MidiNote[],
    public instrument: Instrument
  ) {
    this._update();
  }

  private _current: MidiNote[] = [];

  // private _output = ctx.createGain();


  play(note: MidiNote) {
    if (this._current.includes(note)) return false;
    this._current.push(note);
    const n = `${note.note}${note.octave}`;
    this.instrument.play(n);
    return n;
    // iNotes.forEach(n => n.connect(this._output));
  }

  triggerRelease(note: MidiNote) {
    if (!this._current.includes(note)) return false;
    const n = `${note.note}${note.octave}`;
    this.instrument.triggerRelease(n);
    this._current.splice(this._current.indexOf(note), 1)
    return true;
  }


  private _update() {
    const t = Clock.currentBeat;
    const fidelity = 0.05;

    this.notes.forEach(n => {
      const end = Math.abs(n.start + n.duration) - t;
      if (Math.abs(n.start - t) < fidelity) this.play(n);
      else if (end < fidelity) this.triggerRelease(n);
    });

    requestAnimationFrame(this._update.bind(this));
  }


}
