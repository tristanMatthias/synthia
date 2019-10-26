import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';

import { AudioClip } from './AudioTrack/AudioClip';
import { AudioTrack } from './AudioTrack/AudioTrack';
import { AudioTrackClip } from './AudioTrack/AudioTrackClip';
import { blobMerge } from './blobConverter';
import { Clock } from './Clock';
import { EventObject } from './EventObject/EventObject';
import { Keyboard } from './Keyboard';
import { MidiClip } from './MidiTrack/MidiClip';
import { MidiTrack } from './MidiTrack/MIDITrack';
import { MidiTrackClip } from './MidiTrack/MidiTrackClip';
import { project } from './Project/Project';

export interface RecorderEvents {
  recording: boolean;
  stopRecording: true;
}

export const RecordController = new class extends EventObject<RecorderEvents> {

  private _armedMidiTracks: Map<MidiTrack, boolean> = new Map();
  private _armedAudioTracks: Map<AudioTrack, boolean> = new Map();

  private _midiRecordings: { midiClip: MidiClip, midiTrackClip: MidiTrackClip }[] = [];
  private _audioRecordings: { audioClip: AudioClip, audioTrackClip: AudioTrackClip }[] = [];

  private _startedRecording: number | null = null;
  private _currentNotes: Map<string, EMidiClipNote[]> = new Map();

  constructor() {
    super();
    Clock.on('pause', this._stopRecording.bind(this));
    Clock.on('stop', this._stopRecording.bind(this));
    Keyboard.on('attack', this._startRecordNote.bind(this));
    Keyboard.on('release', this._stopRecordNote.bind(this));
  }

  private _recording: boolean = false;
  public get recording() {
    return this._recording;
  }
  public set recording(v) {
    if (this._recording === v) return;
    this._recording = v;
    this.emit('recording', v);
    if (v) this._startRecording();
  }


  armMidiTrack(mt: MidiTrack) {
    this._armedMidiTracks.set(mt, true);
  }
  disarmMidiTrack(mt: MidiTrack) {
    if (this._armedMidiTracks.has(mt)) this._armedMidiTracks.delete(mt);
  }

  armAudioTrack(at: AudioTrack) {
    this._armedAudioTracks.set(at, true);
  }
  disarmAudioTrack(at: AudioTrack) {
    if (this._armedAudioTracks.has(at)) this._armedAudioTracks.delete(at);
  }


  private _startRecording() {
    Clock.play();
    this._startedRecording = Clock.currentBeatExact;

    this._midiRecordings = Array.from(this._armedMidiTracks.entries())
      .map(([mt]) => mt.recordMidiClip());

    this._audioRecordings = Array.from(this._armedAudioTracks.entries())
      .map(([at]) => at.recordAudioClip());

    this._recordTick();
  }


  private async _stopRecording() {
    if (!this.recording) return;
    this._startedRecording = null;
    this.recording = false;

    await Promise.all(this._midiRecordings.map(({ midiClip: mc, midiTrackClip: mtc }) =>
      project.saveRecordedMidiTrackClip(
        mtc.midiTrack,
        mtc.midiTrackClip.start,
        mc
      )
    ));

    await Promise.all(this._audioRecordings.map(async ({ audioClip: ac, audioTrackClip: atc }) => {
      atc.audioTrack.stopRecording();
      const blob = await atc.audioTrack.recorder.recording.promise;

      return project.saveRecordedAudioTrackClip(
        atc.audioTrack,
        atc.audioTrackClip.start,
        ac,
        await blobMerge(blob)
      )
    }));


    this._midiRecordings = [];
    this._audioRecordings = [];
    this.emit('stopRecording', true);
  }


  private _startRecordNote(note: string) {
    const notes = this._midiRecordings.map(({ midiClip, midiTrackClip }) =>
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
    this._midiRecordings.forEach(({ midiClip: mc, midiTrackClip: mtc }) => {
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
