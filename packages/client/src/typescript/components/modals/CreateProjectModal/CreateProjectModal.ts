import { css, customElement, property, query } from 'lit-element';
import { html } from 'lit-html';

import { SElement } from '../../../types';
import { Form } from '../../ui/Form/Form';
import { Modal } from '../../ui/Modal/Modals';
import { fileService } from '../../../lib/File/FileService';
import { History } from '../../../lib/History';

@customElement(SElement.modalCreateProject)
export class CustomProjectModal extends Modal {

  static styles = [
    ...Modal.styles,
    css`:host { min-width: 45rem; }`
  ]

  heading = 'Create a new project';
  app = document.querySelector(SElement.app)!;

  @query(SElement.form)
  form: Form;

  @property()
  loading = false;

  get buttons() {
    return [
      {
        text: 'Create',
        color: 'text',
        action: this.create,
        loading: this.loading
      },
      {
        text: 'Cancel',
        color: 'main',
        hollow: true,
        action: () => this._modal.close()
      }
    ]
  }

  render() {
    return html`
      ${this._renderHeader()}
      <main>
        <synthia-form>
          <label>Project name</label>
          <synthia-input name="name" placeholder="My new project"></synthia-input>
        </synthia-form>
      </main>
      ${this._renderFooter()}
    `;
  }

  async create() {
    this.loading = true;
    this.requestUpdate();
    const pj = await fileService.newProject(this.form.values.name);
    History.push(`/project/${pj.id}`);
    this.close();
  }
}
