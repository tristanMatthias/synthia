import { customElement, html, LitElement } from 'lit-element';

import { fileService } from '../../../../lib/File/FileService';
import { Instrument } from '../../../../lib/Instruments/Instrument';
import { MidiTrack } from '../../../../lib/MidiTrack/MIDITrack';
import { project } from '../../../../lib/Project/Project';
import { SElement } from '../../../../types';
import styles from './project-home.styles';

export * from './TrackList/TrackList';
export * from './Track/Track';

@customElement(SElement.projectHomePage)
export class PageProjectHome extends LitElement {
  notes = [];
  synth: Instrument;

  static styles = [styles];

  constructor() {
    super();
    fileService.on('loaded', () => {
      this.synth = Object.values(project.instruments)[0];
      new MidiTrack(this.notes, this.synth);
      this.requestUpdate()
    });
  }

  render() {
    if (!project.file) return html``;

    return html`
      <s-track-list></s-track-list>
      <s-text type="h4">Synths in this project</s-text>
      <div class="synths">
        ${project.file!.resources.synths.map((s, i) => html`<a
          title=${s.name}
          href=${`/project/${project.file!.id}/synth/${s.id}`}
          style="animation-delay: ${Math.log(i + 1) / 5}s"
        ><s-card>
          ${s.name}
          <s-from-now .time=${s.createdAt}></s-from-now>
        </s-card></a>`)}
      </div>
      <s-piano-roll .notes=${this.notes}></s-piano-roll>
    `
  }

}
