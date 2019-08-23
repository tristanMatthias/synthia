import { ctx } from '../AudioContext';
import { Clock } from '../Clock';
import { MidiNote } from './MIDINote';
import { Instrument } from '../Instruments/Instrument';


export class MidiTrack {
  constructor(
    public notes: MidiNote[],
    public instrument: Instrument
  ) {
    this._update();
  }

  private _output = ctx.createGain();


  play(note: MidiNote) {
    const n = `${note.note}${note.octave}`;
    const iNotes = this.instrument.play(n);
    iNotes.forEach(n => n.connect(this._output));
  }

  triggerRelease(note: MidiNote) {
    const n = `${note.note}${note.octave}`;
    this.instrument.triggerRelease(n);
  }


  private _update() {
    const t = Clock.currentTime;
    const fidelity = 0.01;
    this.notes.forEach(n => {
      if (Math.abs(n.start - t) < fidelity) this.play(n);
      else if (Math.abs(n.start + n.duration) - t < fidelity) this.triggerRelease(n);
    });

    requestAnimationFrame(this._update.bind(this));
  }


}
