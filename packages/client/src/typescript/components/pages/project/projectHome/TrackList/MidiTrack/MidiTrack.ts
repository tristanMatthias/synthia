import { customElement, html, query } from 'lit-element';

import { MidiClip } from '../../../../../../lib/MidiTrack/MidiClip';
import { MidiTrack } from '../../../../../../lib/MidiTrack/MIDITrack';
import { MidiTrackClip } from '../../../../../../lib/MidiTrack/MidiTrackClip';
import { project } from '../../../../../../lib/Project/Project';
import { RecordController } from '../../../../../../lib/RecordController';
import { SElement } from '../../../../../../types';
import { ClipEditor } from '../../../../../visualizations/ClipEditor/ClipEditor';
import { Track, TrackView, TrackEvents } from '../Track';
import { TrackClip } from './MidiTrackClip/MidiTrackClip';


export * from './MidiTrackClip/MidiTrackClip';
export * from './MidiTrackInstrument/MidiTrackInstrument';

@customElement(SElement.midiTrack)
export class MidiTrackElement extends Track {

  _toaster = document.querySelector(SElement.toaster)!;

  _track: MidiTrack;

  public get track() {
    return this._track;
  }
  public set track(v) {
    if (this._track) this._track.off('recordingMidi', this._addRecordingClip);
    this._track = v;
    if (this._track) this._track.on('recordingMidi', this._addRecordingClip);
  }

  get name() {
    return this.track.midiTrack.name;
  }


  @query(SElement.clipEditor)
  private _editor: ClipEditor;

  constructor() {
    super();
    this._addRecordingClip = this._addRecordingClip.bind(this);
  }

  render() {
    if (!this.track) return;
    const parent = super.render();

    return html`
      ${parent}

      ${this.view === TrackView.track

        ? html`<s-clip-editor
          class="${RecordController.recording && this.recording ? 'recording' : ''}"
          .clipElement=${SElement.midiTrackClip}
          @add=${this._handleAddMidiClip}
          @initialized=${this._setupEditor}
          @select=${this._openPianoRoll}
          @deselect=${() => this.dispatchEvent(new CustomEvent(TrackEvents.closePianoRoll, { bubbles: true, composed: true }))}
          @remove=${this._handleEditorRemove}
        ></s-clip-editor>`

        : html`<s-track-instrument .track=${this.track}></s-track-instrument>`
      }
    `;
  }


  protected _handleDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const instrumentId = e.dataTransfer.getData('instrument');
    if (!instrumentId) return;

    this.track.instrument = project.instruments[instrumentId]!;
    this._toaster.info(`Synth added to ${this.track.midiTrack.name}`);
    this.requestUpdate();
  }


  private async _handleAddMidiClip(e: CustomEvent<TrackClip>) {
    const c = e.detail;
    c.midiTrackClip = await this.track.createMidiClip(c.start);
  }


  private _setupEditor() {
    const editor = this._editor;
    this.track.midiTrackClips.forEach(mtc => {
      if (mtc.recording) return;
      // TODO: MC Duration
      const clip = editor.createClip(
        mtc.midiTrackClip.start,
        0,
        mtc.midiTrackClip.duration,
        true
      ) as TrackClip;

      clip.midiTrackClip = mtc;
      editor.appendChild(clip);
    })
  }

  private _openPianoRoll(e: CustomEvent<TrackClip[]>) {
    const [clip] = e.detail;
    this.dispatchEvent(new CustomEvent(TrackEvents.openPianoRoll, {
      detail: clip.midiTrackClip,
      bubbles: true,
      composed: true
    }));
  }

  private _handleEditorRemove(e: CustomEvent<TrackClip[]>) {
    e.detail.forEach(n => this.track.removeMidiClip(n.mc!));
  }

  private _addRecordingClip({ midiTrackClip: mtc }: { midiClip: MidiClip, midiTrackClip: MidiTrackClip }) {
    const e = this._editor;

    const clip = e.createClip(
      mtc.midiTrackClip.start,
      0,
      mtc.midiTrackClip.duration,
      true
    ) as TrackClip;
    clip.midiTrackClip = mtc;
    clip.recording = true;
    e.appendChild(clip);

    RecordController.once('stopRecording', () => {
      e.clear();
      this._setupEditor();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.midiTrack]: MidiTrackElement;
  }
}
