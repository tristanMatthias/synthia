import { LitElement, customElement, html } from "lit-element";
import styles from './track-list.styles';
import { project } from "../../../../../lib/Project/Project";

@customElement('s-track-list')
export class TrackList extends LitElement {
  static styles = [styles];

  render() {

    return html`${Object.values(project.midiTracks).map(t => html`<s-track
      .midiTrack=${t}
    ></s-track>`)}`;
  }
}
