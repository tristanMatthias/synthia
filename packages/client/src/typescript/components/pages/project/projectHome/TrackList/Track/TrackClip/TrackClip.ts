import { EMidiTrackClip } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { customElement, html } from 'lit-element';

import { MidiClip } from '../../../../../../../lib/MidiTrack/MidiClip';
import { MidiTrack } from '../../../../../../../lib/MidiTrack/MIDITrack';
import { ClipEditorClip } from '../../../../../../visualizations/ClipEditor/Clip/Clip';
import styles from './track-clip.styles';

@customElement('s-track-clip')
export class TrackClip extends ClipEditorClip {
  static styles = [
    ...ClipEditorClip.styles,
    styles
  ];

  midiTrack: MidiTrack;
  midiClip: MidiClip;
  trackClipObject: EMidiTrackClip;

  protected _start: number;
  public get start() { return this._start; }
  public set start(v: number) {
    this._start = v;
    if (this.trackClipObject) this.trackClipObject.start = v;
    this._updatePosition();
  }

  protected _duration: number;
  public get duration() { return this._duration; }
  public set duration(v: number) {
    this._duration = v;
    if (this.trackClipObject) this.trackClipObject.duration = v;
    this._updatePosition();
  }

  render() {
    console.log('rendered');

    return html`
      <header>${this.midiClip.midiClipObject.name}</header>
      <div>Yo</div>
    `;
  }
}
