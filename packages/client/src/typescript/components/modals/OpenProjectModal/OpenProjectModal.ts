import { EProject } from '@synthia/api';
import { customElement, property } from 'lit-element';
import { html } from 'lit-html';

import { SElement } from '../../../types';
import { Modal } from '../../ui/Modal/Modals';
import styles from './open-project.styles';
import { fileService } from '../../../lib/File/FileService';

@customElement(SElement.modalOpenProject)
export class OpenProjectModal extends Modal {

  static styles = [
    ...Modal.styles,
    styles
  ]

  heading = 'Open a project';
  projects: EProject[];

  async connectedCallback() {
    super.connectedCallback();
    this.loading = true;
    this.projects = await fileService.list();
    this.loading = false;
  }

  @property()
  loading = false;

  render() {
    return html`
      ${this._renderHeader()}
      <main>
        ${this.loading
          ? html`<synthia-loading></synthia-loading>`
          : html`
            <h4>My projects</h4>
            <div class="projects">
              ${this.projects.map(pj => html`<a
                href=${`/project/${pj.id}`}
                @click=${() => this.close()}
              ><synthia-card>
                ${pj.name}
                <synthia-from-now .time=${pj.createdAt}></synthia-from-now>
              </synthia-card></a>`)}
            </div>`
        }
      </main>
      <aside>
        <h4>Learn</h4>
      </aside>
      <footer>
        <h4>Explore</h4>
      </footer>
    `;
  }

}
