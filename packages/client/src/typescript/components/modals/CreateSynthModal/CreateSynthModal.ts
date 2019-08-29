import { css, customElement, property, query } from 'lit-element';
import { html } from 'lit-html';

import { SElement } from '../../../types';
import { Form } from '../../ui/Form/Form';
import { Modal } from '../../ui/Modal/Modals';
import { fileService } from '../../../lib/File/FileService';
import { History } from '../../../lib/History';
import { project } from '../../../lib/Project/Project';

@customElement(SElement.modalCreateSynth)
export class CustomSynthModal extends Modal {

  static styles = [
    ...Modal.styles,
    css`:host { min-width: 45rem; }`
  ]

  heading = 'Create a new synth';
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
        <s-form>
          <label>Synth name</label>
          <s-input name="name" placeholder="My new synth"></s-input>
        </s-form>
      </main>
      ${this._renderFooter()}
    `;
  }

  async create() {
    this.loading = true;
    this.requestUpdate();
    const synth = await fileService.newSynth(this.form.values.name);
    if (synth) History.push(`/project/${project.file!.id}/synth/${synth.id}`);
    this.close();
  }
}
