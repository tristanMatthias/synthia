import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { EMidiTrack, EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { Gain } from 'tone';

import { Instrument } from '../Instruments/Instrument';
import { project } from '../Project/Project';
import { MidiClip } from './MidiClip';
import { MidiTrackClip } from './MidiTrackClip';


export class MidiTrack {
  midiTrackClips: MidiTrackClip[] = [];

  input = new Gain();


  private _instrument?: Instrument;
  public get instrument() {
    return this._instrument;
  }
  public set instrument(v) {
    if (v) this.midiTrack.instrumentId = v.id;
    else this.midiTrack.instrumentId = undefined;
    if ((!this._instrument && v) || (v && this._instrument && v.id !== this._instrument.id)) {
      this._instrument = v;
      if (this._instrument) this._instrument.connect(this.input);
    }
  }


  constructor(
    public midiTrack: EMidiTrack,
    instrument?: Instrument
  ) {
    this.instrument = instrument;
    // @ts-ignore
    this.input.toMaster();
    this._update();
  }

  private _current: EMidiClipNote[] = [];


  triggerAttack(note: EMidiClipNote) {
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

  async createMidiClip(start: number, duration?: number) {
    return project.registerMidiTrackClip(this, start, duration);
  }

  addMidiClip(mc: MidiClip, tc: EMidiTrackClip) {
    this.midiTrackClips.push(new MidiTrackClip(this, mc, tc));
  }

  async removeMidiClip(mc: MidiClip) {
    this.midiTrackClips = this.midiTrackClips.filter(mtc => mtc.midiClip !== mc);
    this.midiTrack.midiClips = this.midiTrack.midiClips.filter(mtc =>
      mtc.clipId !== mc.midiClipObject.id
    );
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
