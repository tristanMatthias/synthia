import { customElement, html, LitElement, property, query } from 'lit-element';

import { MidiTrack } from '../../../../../../lib/MidiTrack/MIDITrack';
import { project } from '../../../../../../lib/Project/Project';
import { SElement } from '../../../../../../types';
import { ClipEditor } from '../../../../../visualizations/ClipEditor/ClipEditor';
import { GainMeter } from '../../../../../visualizations/GainMeter/GainMeter';
import { Browser, BrowserEvents } from '../../Browser/Browser';
import styles from './track.styles';
import { TrackClip } from './TrackClip/TrackClip';

export * from './TrackClip/TrackClip';
export * from './TrackInstrument/TrackInstrument';

export enum TrackEvents {
  openPianoRoll = 'openPianoRoll',
  closePianoRoll = 'closePianoRoll'
}

@customElement(SElement.track)
export class Track extends LitElement {
  static styles = [styles];

  midiTrack: MidiTrack;

  @property({ reflect: true, type: Boolean })
  collapsed: boolean = false;

  @property({ reflect: true, type: Boolean })
  recording: boolean = false;

  @property({ reflect: true, type: Boolean })
  muted: boolean = false;

  @property({ reflect: true })
  view: 'instrument' | 'midi' = 'midi';

  @query(SElement.gainMeter)
  gainMeter: GainMeter;

  _toaster = document.querySelector(SElement.toaster)!;


  private _gain: number = 1;
  public get gain(): number {
    return this._gain;
  }
  public set gain(v: number) {
    this.midiTrack.input.gain.value = v;
    this._gain = v;
    this.requestUpdate();
  }

  browser: Browser;

  @property()
  private _highlight = false;

  @property({reflect: true, type: Boolean})
  // @ts-ignore
  private highlightHover = false;

  constructor() {
    super();
    this._addHighlight = this._addHighlight.bind(this);
    this._removeHighlight = this._removeHighlight.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('drop', this._handleDrop);
    this.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.highlightHover = true;
    });
    this.addEventListener('dragleave', () => { this.highlightHover = false; });
    this.browser = document.querySelector(SElement.projectHomePage)!.shadowRoot!.querySelector('s-browser') as Browser;
    this.browser.addEventListener(BrowserEvents.draggingSynth, this._addHighlight);
    window.addEventListener('drop', this._removeHighlight);
    window.addEventListener('dragend', this._removeHighlight);
  }

  render() {
    if (!this.midiTrack) return;

    return html`
      ${this._highlight ? html`<span class="highlight"></span>` : null}
      <s-gain-meter
        @change=${this._handleGainChange}
        .value=${this.gain}
      ></s-gain-meter>
      <div class="controls">

        <div class="name"
          @click=${() => this.collapsed = !this.collapsed}
          tooltip=${this.collapsed ? 'Open' : 'Collapse'}
        >
          <s-icon type="collapsed" class="collapse"></s-icon>
          <s-text>${this.midiTrack.midiTrack.name}</s-text>
        </div>

        <div class="button">
          <s-button
            id="record"
            icon="record"
            hollow
            small
            color=${this.recording ? 'error' : 'main'}
            @click=${() => this.recording = !this.recording}
            tooltip="Record"
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon=${this.muted ? 'noSound' : 'sound'}
            hollow
            small
            color=${this.muted ? 'main' : 'alt'}
            @click=${() => this.muted = !this.muted}
            tooltip=${this.muted ? 'Unmute' : 'Mute'}
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon="synth"
            hollow
            small
            color=${this.view != 'instrument' ? 'line' : 'alt'}
            @click=${() => this.view = 'instrument'}
            tooltip="View instrument"
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon="midiClip"
            hollow
            small
            color=${this.view != 'midi' ? 'line' : 'alt'}
            @click=${() => this.view = 'midi'}
            tooltip="View MIDI clips"
          ></s-button>
        </div>

        <div class="space"></div>
      </div>

      ${this.view === 'midi'

        ? html`<s-clip-editor
          .clipElement=${"s-track-clip"}
          @add=${this._handleAddMidiClip}
          @initialized=${this._setupEditor}
          @select=${this._openPianoRoll}
          @deselect=${() => this.dispatchEvent(new CustomEvent(TrackEvents.closePianoRoll, { bubbles: true, composed: true }))}
          @remove=${this._handleEditorRemove}
        ></s-clip-editor>`

        : html`<s-track-instrument .track=${this.midiTrack}></s-track-instrument>`
      }
    `;
  }

  firstUpdated(props: Map<string, keyof Track>) {
    super.firstUpdated(props);
    // @ts-ignore
    this.midiTrack.input.connect(this.gainMeter.meterNode);
  }

  updated(props: Map<string, keyof Track>) {
    super.updated(props);
    if (props.has('muted')) {
      this.midiTrack.input.gain.value = this.muted ? 0 : 1;
    }
  }


  private _handleDrop(e: DragEvent) {
    if (!e.dataTransfer) return;
    const instrumentId = e.dataTransfer.getData('instrument');
    if (!instrumentId) return;

    this.midiTrack.instrument = project.instruments[instrumentId]!;
    this._toaster.info(`Synth added to ${this.midiTrack.midiTrack.name}`);
    this.requestUpdate();
  }

  private async _handleAddMidiClip(e: CustomEvent<TrackClip>) {
    const c = e.detail;
    c.midiTrackClip = await this.midiTrack.createMidiClip(c.start);
  }

  private _setupEditor(e: CustomEvent<ClipEditor>) {
    const editor = e.detail;
    this.midiTrack.midiTrackClips.forEach(mtc => {
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
    e.detail.forEach(n => this.midiTrack.removeMidiClip(n.mc!));
  }

  private _handleGainChange(e: CustomEvent<number>) {
    this.gain = e.detail;
  }

  private _addHighlight() { this._highlight = true; }
  private _removeHighlight() {
    this._highlight = false;
    this.highlightHover = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.track]: Track;
  }
}
