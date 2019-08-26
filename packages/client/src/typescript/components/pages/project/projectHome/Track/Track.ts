import { EMidiTrack } from '@synthia/api/dist/gql/entities/MidiTrackEntity';
import { customElement, html, LitElement, property } from 'lit-element';

import styles from './track.styles';

@customElement('s-track')
export class Track extends LitElement {
  static styles = [styles];

  track: EMidiTrack;

  @property({reflect: true, type: Boolean})
  collapsed: boolean = false;

  @property({reflect: true, type: Boolean})
  recording: boolean = false;

  @property({reflect: true, type: Boolean})
  muted: boolean = false;

  render() {
    return html`
      <div class="controls">
        <div class="button">
          <s-button
            icon="collapsed"
            hollow
            small
            class="collapse"
            color="main"
            @click=${() => this.collapsed = !this.collapsed}
            title=${this.collapsed ? 'Open' : 'Collapse'}
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon="record"
            hollow
            small
            color=${this.recording ? 'error' : 'main'}
            @click=${() => this.recording = !this.recording}
            title="Record"
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon=${this.muted ? 'noSound' : 'sound'}
            hollow
            small
            color=${this.muted ? 'main' : 'alt'}
            @click=${() => this.muted = !this.muted}
            title=${this.muted ? 'Unmute' : 'Mute'}
          ></s-button>
        </div>
        <s-text class="name">${this.track.name}</s-text>
      </div>
      <s-track-clip-editor></s-track-clip-editor>
    `;
  }
}
