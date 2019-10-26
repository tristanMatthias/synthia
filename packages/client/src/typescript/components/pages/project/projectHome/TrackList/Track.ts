import { html, LitElement, property, query } from 'lit-element';

import { AudioTrack } from '../../../../../lib/AudioTrack/AudioTrack';
import { MidiTrack } from '../../../../../lib/MidiTrack/MIDITrack';
import { RecordController } from '../../../../../lib/RecordController';
import { SElement } from '../../../../../types';
import { GainMeter } from '../../../../visualizations/GainMeter/GainMeter';
import { Browser, BrowserEvents } from '../Browser/Browser';
import styles from './track.styles';

export enum TrackView {
  track = 'track',
  rack = 'rack'
}

export enum TrackEvents {
  openPianoRoll = 'openPianoRoll',
  closePianoRoll = 'closePianoRoll'
}


export class Track extends LitElement {
  static styles = [styles];

  @property({ reflect: true, type: Boolean })
  collapsed: boolean = false;

  @property({ reflect: true, type: Boolean })
  recording: boolean = false;

  @property({ reflect: true, type: Boolean })
  muted: boolean = false;

  @property({ reflect: true })
  view: TrackView = TrackView.track;

  @query(SElement.gainMeter)
  gainMeter: GainMeter;


  protected _track: MidiTrack | AudioTrack;
  public get track() { return this._track; }
  public set track(v) { this._track = v; }


  private _gain: number = 1;
  public get gain(): number {
    return this._gain;
  }
  public set gain(v: number) {
    this.track.input.volume.value = (v * 48) - 48;
    this._gain = v;
    this.requestUpdate();
  }

  browser: Browser;

  @property()
  private _highlight = false;

  @property({ reflect: true, type: Boolean })
  // @ts-ignore
  private highlightHover = false;


  get name() {
    return '';
  }

  constructor() {
    super();
    this._addHighlight = this._addHighlight.bind(this);
    this._removeHighlight = this._removeHighlight.bind(this);
    RecordController.on('recording', () => this.requestUpdate());
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
    if (!this.track) return;

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
          <s-text>${this.name}</s-text>
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
            color=${this.view != TrackView.rack ? 'line' : 'alt'}
            @click=${() => this.view = TrackView.rack}
            tooltip="View instrument"
          ></s-button>
        </div>
        <div class="button">
          <s-button
            icon="midiClip"
            hollow
            small
            color=${this.view != TrackView.track ? 'line' : 'alt'}
            @click=${() => this.view = TrackView.track}
            tooltip="View MIDI clips"
          ></s-button>
        </div>

        <div class="space"></div>
      </div>
    `;
  }

  firstUpdated(props: Map<string, keyof Track>) {
    super.firstUpdated(props);
    // @ts-ignore
    this.track.input.connect(this.gainMeter.meterNode);
  }

  updated(props: Map<string, keyof Track>) {
    super.updated(props);
    if (props.has('muted')) {
      this.track.input.mute = this.muted;
    }
    if (props.has('recording')) {
      if (this.recording) this.track.arm();
      else this.track.disarm();
    }
  }


  protected _handleDrop(_e: DragEvent) { }

  private _handleGainChange(e: CustomEvent<number>) {
    this.gain = e.detail;
  }

  private _addHighlight() { this._highlight = true; }
  private _removeHighlight() {
    this._highlight = false;
    this.highlightHover = false;
  }
}
