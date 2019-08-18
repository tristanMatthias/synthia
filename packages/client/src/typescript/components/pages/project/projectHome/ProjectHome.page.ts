import { customElement, html, LitElement } from 'lit-element';

import { model } from '../../../../lib/Model/Model';
import { SElement } from '../../../../types';
import styles from './project-home.styles';
import { fileService } from '../../../../lib/File/FileService';

@customElement(SElement.projectHomePage)
export class PageProjectHome extends LitElement {

  static get styles() {
    return [styles]
  }

  constructor() {
    super();
    fileService.on('loaded', () => this.requestUpdate());
  }

  render() {
    if (!model.file) return html``;

    return html`
      <h4>Synths in this project</h4>
      <div class="synths">
        ${model.file!.resources.synths.map((s, i) => html`<a
          title=${s.name}
          href=${`/project/${model.file!.id}/synth/${s.id}`}
          style="animation-delay: ${Math.log(i + 1) / 5}s"
        ><synthia-card>
          ${s.name}
          <synthia-from-now .time=${s.createdAt}></synthia-from-now>
        </synthia-card></a>`)}
      </div>
      <synthia-piano-roll></synthia-piano-roll>
    `
  }

}
