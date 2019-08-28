import { customElement, html, LitElement, property } from 'lit-element';

import { project } from '../../../../lib/Project/Project';
import { SElement } from '../../../../types';
import styles from './project-home.styles';
import { MidiClip } from '../../../../lib/MidiTrack/MidiClip';

export * from './Browser/Browser';
export * from './TrackList/TrackList';
export * from './TrackList/Track/Track';

@customElement(SElement.projectHomePage)
export class PageProjectHome extends LitElement {

  static styles = [styles];

  @property()
  private _activeMidiClip: {midiClip: MidiClip, start: number, duration: number} | null;

  constructor() {
    super();
    project.on('loadedNewProject', () => this.requestUpdate());
  }

  render() {
    if (!project.file) return html``;

    const active = this._activeMidiClip;

    return html`
      <s-browser></s-browser>
      <main>
        <s-track-list
          @openPianoRoll=${this._handleOpenPianoRoll}
          @closePianoRoll=${() => this._activeMidiClip = null}}
        ></s-track-list>

        ${active
          ? html`<div class="bottom-panel">
            <s-piano-roll
              .midiClip=${active.midiClip}
              .start=${active.start}
              .duration=${active.duration}
            ></s-piano-roll>
          </div>`
          : null}

      </main>
    `
  }

  private _handleOpenPianoRoll(e: CustomEvent) {
    this._activeMidiClip = e.detail;
  }

}
