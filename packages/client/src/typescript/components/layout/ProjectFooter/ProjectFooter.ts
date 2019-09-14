import { customElement, html, LitElement } from 'lit-element';
import debounce = require('lodash.debounce');

import { Clock } from '../../../lib/Clock';
import { Metronome } from '../../../lib/Metronome';
import { Recorder } from '../../../lib/Recorder';
import { SElement } from '../../../types';
import styles from './project-footer.styles';

@customElement(SElement.projectFooter)
export class Page extends LitElement {
  static styles = [styles];

  constructor() {
    super();
    this._update = debounce(this._update.bind(this), 100);
    Clock.on('play', this._update);
    Clock.on('seek', () => this.requestUpdate());
  }

  connectedCallback() {
    super.connectedCallback();
    this._update();
  }

  render() {
    return html`
      <div class="clock">
        <span>${Clock.currentBar + 1}</span>.
        <span>${Clock.currentBarBeat + 1}</span>
      </div>
      <s-button
        hollow
        color="main"
        icon="${Clock.playing ? 'pause' : 'play'}"
        @click=${() => Clock.toggle()}
        tooltip=${Clock.playing ? 'Pause' : 'Play'}
      ></s-button>
      <s-button
        hollow
        color="main"
        icon="stop"
        @click=${() => Clock.stop()}
        tooltip="Stop"
      ></s-button>
      <s-button
        hollow
        color=${Metronome.on ? 'alt' : 'line'}
        icon="metronome"
        @click=${() => {
        Metronome.on = !Metronome.on
        this.requestUpdate();
      }}
        tooltip="Metronome"
      ></s-button>
      <s-button
        hollow
        color=${Recorder.recording ? 'error' : 'line'}
        icon="record"
        @click=${() => {
        Recorder.recording = !Recorder.recording
        this.requestUpdate();
      }}
        tooltip=${Recorder.recording ? 'Stop recording' : 'Record'}
      ></s-button>
    `;
  }

  private _update() {
    this.requestUpdate();
    if (this.isConnected && Clock.playing) window.requestAnimationFrame(this._update)
  }
}

