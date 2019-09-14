import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { EMidiTrack, EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import shortid = require('shortid');
import { Volume } from 'tone';

import { state } from '../../state/state';
import { Clock } from '../Clock';
import { EventObject } from '../EventObject/EventObject';
import { Exporter } from '../Exporter';
import { Instrument } from '../Instruments/Instrument';
import { project } from '../Project/Project';
import { Recorder } from '../Recorder';
import { MidiClip } from './MidiClip';
import { MidiTrackClip } from './MidiTrackClip';

export interface MidiTrackEvents {
  recordingMidi: { midiClip: MidiClip, midiTrackClip: MidiTrackClip }
}

export class MidiTrack extends EventObject<MidiTrackEvents> {
  midiTrackClips: MidiTrackClip[] = [];


  input = new Volume();


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

    this.input.connect(Exporter.dest);
  }


  constructor(
    public midiTrack: EMidiTrack,
    instrument?: Instrument
  ) {
    super();
    this.instrument = instrument;
    this.input.toMaster();
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


  arm() { Recorder.armTrack(this); }
  disarm() { Recorder.disarmTrack(this); }

  recordMidiClip() {
    const mc = new MidiClip({
      id: shortid(),
      createdAt: new Date(),
      creatorId: state.user.data!.id,
      duration: 0,
      name: 'Recorded clip',
      notes: [],
      public: true
    });
    const tco: EMidiTrackClip = {
      clipId: mc.midiClipObject.id,
      duration: 0,
      start: Clock.currentBeatExact
    };
    const mtc = new MidiTrackClip(this, mc, tco);
    mtc.recording = true;

    this.midiTrackClips.push(mtc);

    const res = { midiClip: mc, midiTrackClip: mtc };
    this.emit('recordingMidi', res);
    // this.midiTrack.midiClips.push(tco);
    Recorder.once('stopRecording', () => {
      console.log('before', this.midiTrackClips.length);

      const i = this.midiTrackClips.findIndex(_mtc => _mtc === mtc);
      this.midiTrackClips.splice(i, 1);
      console.log('after', this.midiTrackClips.length);
    });

    return res;
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
}
