import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { EMidiTrack } from '@synthia/api/dist/gql/entities/MidiTrackEntity';

import { Instrument } from '../Instruments/Instrument';
import { MidiClip } from './MidiClip';


export class MidiTrack {
  midiClips: Map<MidiClip, number> = new Map();


  private _instrument?: Instrument;
  public get instrument() {
    return this._instrument;
  }
  public set instrument(v) {
    if (v) this.midiTrack.instrumentId = v.id;
    else this.midiTrack.instrumentId = undefined;
    this._instrument = v;
  }


  constructor(
    public midiTrack: EMidiTrack,
    instrument?: Instrument
  ) {
    this.instrument = instrument;
    this._update();
  }

  private _current: EMidiClipNote[] = [];


  play(note: EMidiClipNote) {
    if (!this.instrument) return false;
    if (this._current.includes(note)) return false;
    this._current.push(note);
    const n = note.n;
    this.instrument.triggerAttack([n]);
    return n;
  }

  triggerRelease(note: EMidiClipNote) {
    if (!this.instrument) return false;
    if (!this._current.includes(note)) return false;
    const n = note.n;
    this.instrument.triggerRelease([n]);
    this._current.splice(this._current.indexOf(note), 1)
    return true;
  }


  createMidiClip(start: number, mc: MidiClip) {
    this.midiClips.set(mc, start);
  }


  private _update() {
    // const t = Clock.currentBeat;
    // const fidelity = 0.05;

    // this.midiClips.forEach(mc => {
    //   mc.notes.forEach(n => {
    //     const end = Math.abs(n.s + n.d) - t;
    //     if (Math.abs(n.s - t) < fidelity) this.play(n);
    //     else if (end < fidelity) this.triggerRelease(n);
    //   });
    // });

    // requestAnimationFrame(this._update.bind(this));
  }


}
