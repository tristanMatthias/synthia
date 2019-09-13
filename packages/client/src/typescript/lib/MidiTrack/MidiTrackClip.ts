import { MidiTrack } from "./MIDITrack";
import { MidiClip } from "./MidiClip";
import { proxa } from "proxa";
import { Transport } from "tone";
import { EMidiTrackClip } from "@synthia/api/dist/gql/entities/MidiTrackEntity";
import { beatsToTime } from "../beatsToTime";

export class MidiTrackClip {

  private _transportEvents: number[] = [];
  recording: boolean = false;

  constructor(
    public midiTrack: MidiTrack,
    public midiClip: MidiClip,
    public midiTrackClip: EMidiTrackClip
  ) {
    proxa(this.midiClip.midiClipObject, this._update.bind(this));
    proxa(this.midiTrackClip, () => this._update());
    this._update();
  }

  private _update() {
    this._transportEvents.forEach(i => Transport.clear(i));
    // The attack
    this.midiClip.notes.forEach(n => {
      this._transportEvents.push(Transport.schedule(
        () => this.midiTrack.triggerAttack(n),
        beatsToTime(n.s + this.midiTrackClip.start)
      ));
    });
    // The release
    this.midiClip.notes.forEach(n => {
      this._transportEvents.push(Transport.schedule(
        () => this.midiTrack.triggerRelease(n),
        beatsToTime(n.s + this.midiTrackClip.start + n.d)
      ));
    });
  }

  // finishRecording(mc: MidiClip, mtc: EMidiTrackClip) {
  //   this.recording = false;
  //   this.midiClip = mc;
  //   this.midiTrackClip = mtc;
  //   proxa(this.midiClip.midiClipObject, this._update.bind(this));
  //   proxa(this.midiTrackClip, () => this._update());
  //   this._update();
  // }
}
