import { EMidiTrack } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { customElement, html, LitElement } from 'lit-element';
import styles from './track-clip-editor.styles';


@customElement('s-track-clip-editor')
export class TrackClipEditor extends LitElement {
  static styles = [styles];

  track: EMidiTrack;

  render() {
    return html`<s-clock-line></s-clock-line>`;
  }
}
