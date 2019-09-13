import { customElement, html, LitElement, property, query } from 'lit-element';

import { MidiTrack } from '../../../../../../lib/MidiTrack/MIDITrack';
import { project } from '../../../../../../lib/Project/Project';
import { Recorder } from '../../../../../../lib/Recorder';
import { SElement } from '../../../../../../types';
import { ClipEditor } from '../../../../../visualizations/ClipEditor/ClipEditor';
import { GainMeter } from '../../../../../visualizations/GainMeter/GainMeter';
import { Browser, BrowserEvents } from '../../Browser/Browser';
import styles from './track.styles';
import { TrackClip } from './TrackClip/TrackClip';
import { MidiClip } from '../../../../../../lib/MidiTrack/MidiClip';
import { MidiTrackClip } from '../../../../../../lib/MidiTrack/MidiTrackClip';

export * from './TrackClip/TrackClip';
export * from './TrackInstrument/TrackInstrument';

export enum TrackEvents {
  openPianoRoll = 'openPianoRoll',
  closePianoRoll = 'closePianoRoll'
}

@customElement(SElement.track)
export class Track extends LitElement {
  static styles = [styles];

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



  private _midiTrack: MidiTrack;
  public get midiTrack() {
    return this._midiTrack;
  }
  public set midiTrack(v) {
    if (this._midiTrack) this._midiTrack.off('recordingMidi', this._addRecordingClip);
    this._midiTrack = v;
    if (this._midiTrack) this._midiTrack.on('recordingMidi', this._addRecordingClip);
  }


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

  @property({ reflect: true, type: Boolean })
  // @ts-ignore
  private highlightHover = false;


  @query(SElement.clipEditor)
  private _editor: ClipEditor;

  constructor() {
    super();
    this._addHighlight = this._addHighlight.bind(this);
    this._removeHighlight = this._removeHighlight.bind(this);
    this._addRecordingClip = this._addRecordingClip.bind(this);
    Recorder.on('recording', () => this.requestUpdate());
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
          class="${Recorder.recording && this.recording ? 'recording' : ''}"
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
    if (props.has('recording')) {
      if (this.recording) this.midiTrack.arm();
      else this.midiTrack.disarm();
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

  private _setupEditor() {
    const editor = this._editor;
    this.midiTrack.midiTrackClips.forEach(mtc => {
      if (mtc.recording) return;
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

  private _addRecordingClip({ midiTrackClip: mtc }: { midiClip: MidiClip, midiTrackClip: MidiTrackClip }) {
    const e = this._editor;

    const clip = e.createClip(
      mtc.midiTrackClip.start,
      0,
      mtc.midiTrackClip.duration,
      true
    ) as TrackClip;
    clip.midiTrackClip = mtc;
    clip.recording = true;
    e.appendChild(clip);

    Recorder.once('stopRecording', () => {
      e.clear();
      this._setupEditor();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.track]: Track;
  }
}
