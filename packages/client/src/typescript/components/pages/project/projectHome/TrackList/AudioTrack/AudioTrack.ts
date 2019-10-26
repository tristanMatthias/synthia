import { customElement, html, query } from 'lit-element';

import { AudioClip } from '../../../../../../lib/AudioTrack/AudioClip';
import { AudioTrack } from '../../../../../../lib/AudioTrack/AudioTrack';
import { AudioTrackClip } from '../../../../../../lib/AudioTrack/AudioTrackClip';
import { RecordController } from '../../../../../../lib/RecordController';
import { SElement } from '../../../../../../types';
import { ClipEditor } from '../../../../../visualizations/ClipEditor/ClipEditor';
import { Track, TrackEvents, TrackView } from '../Track';
import { AudioTrackClipElement } from './AudioTrackClip/AudioTrackClip';

export * from './AudioTrackClip/AudioTrackClip';


@customElement(SElement.audioTrack)
export class AudioTrackElement extends Track {

  _toaster = document.querySelector(SElement.toaster)!;

  _track: AudioTrack;

  public get track() {
    return this._track;
  }
  public set track(v) {
    if (this._track) this._track.off('recordingAudio', this._addRecordingClip);
    this._track = v;
    if (this._track) this._track.on('recordingAudio', this._addRecordingClip);
  }

  get name() {
    return this.track.audioTrack.name;
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
          .dblClick=${false}
          emptyText="Drag an audio file to upload"
          .clipElement=${SElement.audioTrackClip}
          @add=${this._handleAddAudioClip}
          @initialized=${this._setupEditor}
          @deselect=${() => this.dispatchEvent(new CustomEvent(TrackEvents.closePianoRoll, { bubbles: true, composed: true }))}
          @remove=${this._handleEditorRemove}
        ></s-clip-editor>`

        : html`<s-track-instrument .track=${this.track}></s-track-instrument>`
      }
    `;
  }


  private async _handleAddAudioClip(e: CustomEvent<AudioTrackClipElement>) {
    const c = e.detail;
    c.audioTrackClip = await this.track.createAudioClip(c.start);
  }


  private _setupEditor() {
    const editor = this._editor;
    this.track.audioTrackClips
      .sort((a, b) => {
        if (a.audioTrackClip.start < b.audioTrackClip.start) return -1;
        else if (a.audioTrackClip.start > b.audioTrackClip.start) return 1;
        else return 0;
      })
      .forEach(atc => {
        if (atc.recording) return;
        // TODO: MC Duration
        const clip = editor.createClip(
          atc.audioTrackClip.start,
          0,
          atc.audioTrackClip.duration,
          true
        ) as AudioTrackClipElement;

        clip.audioTrackClip = atc;
        editor.appendChild(clip);
      })
  }


  private _handleEditorRemove(e: CustomEvent<AudioTrackClipElement[]>) {
    console.log('CALLING EDITOR REMOVE');

    e.detail.forEach(n => this.track.removeAudioClip(n.ac!));
  }


  private _addRecordingClip({ audioTrackClip: atc }: { audioClip: AudioClip, audioTrackClip: AudioTrackClip }) {
    const e = this._editor;
    const clip = e.createClip(
      atc.audioTrackClip.start,
      0,
      atc.audioTrackClip.duration,
      true
    ) as AudioTrackClipElement;
    clip.audioTrackClip = atc;
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
    [SElement.audioTrack]: AudioTrackElement;
  }
}
