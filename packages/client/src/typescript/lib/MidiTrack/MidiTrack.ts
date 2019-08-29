import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { EMidiTrack, EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';

import { API } from '../API/API';
import { Instrument } from '../Instruments/Instrument';
import { project } from '../Project/Project';
import { MidiClip } from './MidiClip';
import { MidiTrackClip } from './MidiTrackClip';


export class MidiTrack {
  midiTrackClips: MidiTrackClip[] = [];


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
    const mcO = await API.createMidiClip(project.file!.id);
    const midiClip = new MidiClip(mcO);
    project.midiClips[mcO.id] = midiClip;

    const trackClipObject: EMidiTrackClip = {
      clipId: mcO.id,
      start,
      duration: duration || mcO.duration
    };

    const mtc = new MidiTrackClip(
      this, midiClip, trackClipObject
    )
    this.midiTrackClips.push(mtc);
    this.midiTrack.midiClips.push(trackClipObject);

    return mtc;
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
