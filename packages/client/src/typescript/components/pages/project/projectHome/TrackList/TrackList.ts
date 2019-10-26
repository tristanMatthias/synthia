import { customElement, html, LitElement } from 'lit-element';

import { API } from '../../../../../lib/API/API';
import { project } from '../../../../../lib/Project/Project';
import styles from './track-list.styles';

@customElement('s-track-list')
export class TrackList extends LitElement {
  static styles = [styles];

  render() {
    const midiTracks = html`${Object.values(project.midiTracks).map(t => html`<s-midi-track
      .track=${t}
    ></s-midi-track>`)}`;


    const audioTracks = html`${Object.values(project.audioTracks).map(t => html`<s-audio-track
      .track=${t}
    ></s-audio-track>`)}`;


    return html`
      <div class="tracks">
        ${midiTracks}
        ${audioTracks}
      </div>
      <s-button @click=${this.addNewMidiTrack}>Add new MIDI track </s-button>
      <s-button @click=${this.addNewAudioTrack}>Add new Audio track </s-button>
    `
  }

  async addNewMidiTrack() {
    const track = await API.createMidiTrack({
      name: 'Midi Track',
      projectId: project.file!.id
    });
    project.registerMidiTrack(track);
  }

  async addNewAudioTrack() {
    const track = await API.createAudioTrack({
      name: 'Audio Track',
      projectId: project.file!.id
    });
    project.registerAudioTrack(track);
  }
}
