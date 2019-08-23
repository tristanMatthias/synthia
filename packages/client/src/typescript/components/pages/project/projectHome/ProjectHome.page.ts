import { customElement, html, LitElement } from 'lit-element';

import { project } from '../../../../lib/Project/Project';
import { SElement } from '../../../../types';
import styles from './project-home.styles';
import { fileService } from '../../../../lib/File/FileService';
// import { MidiTrack } from '../../../../lib/MidiTrack/MIDITrack';

@customElement(SElement.projectHomePage)
export class PageProjectHome extends LitElement {
  notes = [];

  static get styles() {
    return [styles]
  }

  constructor() {
    super();
    fileService.on('loaded', () => this.requestUpdate());
    // new MidiTrack(this.notes, {});
  }

  render() {
    if (!project.file) return html``;

    return html`
      <h4>Synths in this project</h4>
      <div class="synths">
        ${project.file!.resources.synths.map((s, i) => html`<a
          title=${s.name}
          href=${`/project/${project.file!.id}/synth/${s.id}`}
          style="animation-delay: ${Math.log(i + 1) / 5}s"
        ><synthia-card>
          ${s.name}
          <synthia-from-now .time=${s.createdAt}></synthia-from-now>
        </synthia-card></a>`)}
      </div>
      <synthia-piano-roll .notes=${this.notes}></synthia-piano-roll>
    `
  }

}
