import { EMidiClipNote } from '@synthia/api/dist/gql/entities/MidiClipEntity';
import { customElement, html, property } from 'lit-element';
import { proxa } from 'proxa';

import { MidiTrack } from '../../../../../../../lib/MidiTrack/MIDITrack';
import { ClipEditorClip } from '../../../../../../visualizations/ClipEditor/Clip/Clip';
import styles from './track-clip.styles';

@customElement('s-track-clip')
export class TrackClip extends ClipEditorClip {
  static styles = [
    ...ClipEditorClip.styles,
    styles
  ];

  notes: EMidiClipNote[] = proxa([]);
  track: MidiTrack;

  @property({reflect: true, type: Boolean})
  collapsed: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    // const mc = new MidiClip({

    // })
    // this.track.createMidiClip()
  }

  render() {
    return html`
      <header></header>
      <div>Yo</div>
    `;
  }
}
