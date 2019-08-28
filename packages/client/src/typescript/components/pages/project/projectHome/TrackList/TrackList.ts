import { LitElement, customElement, html } from "lit-element";
import styles from './track-list.styles';
import { project } from "../../../../../lib/Project/Project";
import { API } from "../../../../../lib/API/API";

@customElement('s-track-list')
export class TrackList extends LitElement {
  static styles = [styles];

  render() {
    const tracks = html`${Object.values(project.midiTracks).map(t => html`<s-track
      .midiTrack=${t}
    ></s-track>`)}`;

    return html`
      <div class="tracks">${tracks}</div>
      <s-button @click=${this.addNewMidiTrack}>Add new MIDI track </s-button>
    `
  }

  async addNewMidiTrack() {
    const track = await API.createMidiTrack({
      name: 'Midi Track',
      projectId: project.file!.id
    });
    project.registerMidiTrack(track);
  }
}
