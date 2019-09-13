import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';

import { Clock } from './Clock';
import { EventObject } from './EventObject/EventObject';
import { MidiClip } from './MidiTrack/MidiClip';
import { MidiTrack } from './MidiTrack/MIDITrack';
import { MidiTrackClip } from './MidiTrack/MidiTrackClip';
import { Keyboard } from './Keyboard';
import { project } from './Project/Project';

export interface RecorderEvents {
  recording: boolean;
  stopRecording: true;
}

export const Recorder = new class extends EventObject<RecorderEvents> {

  private _armedMidiTracks: Map<MidiTrack, boolean> = new Map();
  private _midiRecordings: {midiClip: MidiClip, midiTrackClip: MidiTrackClip}[] = [];
  private _startedRecording: number | null = null;
  private _currentNotes: Map<string, EMidiClipNote[]> = new Map();

  constructor() {
    super();
    Clock.on('pause', this._stopRecording.bind(this));
    Clock.on('stop', this._stopRecording.bind(this));
    Keyboard.on('attack', this._startRecordNote.bind(this));
    Keyboard.on('release', this._stopRecordNote.bind(this));
  }

  private _recording : boolean = false;
  public get recording() {
    return this._recording;
  }
  public set recording(v) {
    if (this._recording === v) return;
    this._recording = v;
    this.emit('recording', v);
    if (v) this._startRecording();
  }


  armTrack(mt: MidiTrack) {
    this._armedMidiTracks.set(mt, true);
  }
  disarmTrack(mt: MidiTrack) {
    if (this._armedMidiTracks.has(mt)) this._armedMidiTracks.delete(mt);
  }

  private _startRecording() {
    Clock.play();
    this._startedRecording = Clock.currentBeatExact;
    this._midiRecordings = Array.from(this._armedMidiTracks.entries()).map(([mt]) => mt.recordMidiClip());
    this._recordTick();
  }

  private async _stopRecording() {
    if (!this.recording) return;
    this._startedRecording = null;
    this.recording = false;
    await Promise.all(this._midiRecordings.map(({midiClip: mc, midiTrackClip: mtc}) =>
      project.saveRecordedMidiTrackClip(
        mtc.midiTrack,
        mtc.midiTrackClip.start,
        mc
      )
    ));
    this._midiRecordings = [];
    this.emit('stopRecording', true);
  }

  private _startRecordNote(note: string) {
    const notes = this._midiRecordings.map(({midiClip, midiTrackClip}) =>
      midiClip.addNote({
        d: 0,
        s: Clock.currentBeatExact - midiTrackClip.midiTrackClip.start,
        n: note,
        v: 1
      })
    )
    this._currentNotes.set(note, notes);
    Array.from(this._armedMidiTracks.entries()).forEach(([mt]) => {
      if (mt.instrument) mt.instrument.triggerAttack([note]);
    });
  }

  private _stopRecordNote(note: string) {
    this._currentNotes.delete(note);
    Array.from(this._armedMidiTracks.entries()).forEach(([mt]) => {
      if (mt.instrument) mt.instrument.triggerRelease([note]);
    });
  }

  private _recordTick() {
    if (!this.recording) return;
    this._midiRecordings.forEach(({midiClip: mc, midiTrackClip: mtc}) => {
      const t = Clock.currentBeatExact;
      const duration = t - this._startedRecording!;;
      mc.midiClipObject.duration = duration;
      mtc.midiTrackClip.duration = duration;
      mc.notes

      Array.from(this._currentNotes.entries()).forEach(([, notes]) => {
        notes.forEach(n => {
          n.d = t - n.s - mtc.midiTrackClip.start
        });
      });

    });
    window.requestAnimationFrame(this._recordTick.bind(this));
  }
}
