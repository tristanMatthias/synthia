import { customElement, html, LitElement, property } from 'lit-element';

import { MidiTrack } from '../../../../../../lib/MidiTrack/MIDITrack';
import styles from './track.styles';
import { project } from '../../../../../../lib/Project/Project';

export * from './TrackClip/TrackClip';
export * from './TrackInstrument/TrackInstrument';

@customElement('s-track')
export class Track extends LitElement {
  static styles = [styles];

  midiTrack: MidiTrack;

  @property({reflect: true, type: Boolean})
  collapsed: boolean = false;

  @property({reflect: true, type: Boolean})
  recording: boolean = false;

  @property({reflect: true, type: Boolean})
  muted: boolean = false;

  @property({reflect: true})
  view: 'instrument' | 'midi' = 'midi';

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('drop', this._handleDrop);
    this.addEventListener('dragover', (e) => e.preventDefault());
  }

  render() {
    if (!this.midiTrack) return;

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
        <s-text class="name">${this.midiTrack.midiTrack.name}</s-text>
        <div class="button">
          <s-button
            icon="synth"
            hollow
            small
            color=${this.view != 'instrument' ? 'line' : 'alt'}
            @click=${() => this.view = 'instrument'}
            title="View instrument"
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon="midiClip"
            hollow
            small
            color=${this.view != 'midi' ? 'line' : 'alt'}
            @click=${() => this.view = 'midi'}
            title="View MIDI clips"
          ></s-button>
        </div>
      </div>
      ${this.view === 'midi'
        ? html`<s-clip-editor .clipElement=${"s-track-clip"}></s-clip-editor>`
        : html`<s-track-instrument .track=${this.midiTrack}></s-track-instrument>`
      }
    `;
  }

  private _handleDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const instrumentId = e.dataTransfer.getData('instrument');
    if (!instrumentId) return;

    this.midiTrack.instrument = project.instruments[instrumentId]!;
    this.requestUpdate();
  }
}
