import { customElement } from 'lit-element';
import { html } from 'lit-html';

import { SElement } from '../../../types';
import { Modal } from '../../ui/Modal/Modals';
import styles from './open-project.styles';
import { History } from '../../../lib/History';

@customElement(SElement.modalOpenProject)
export class OpenProjectModal extends Modal {

  static styles = [
    ...Modal.styles,
    styles
  ]

  heading = 'Open a project';

  connectedCallback() {
    super.connectedCallback();
    const handleClose = () => {
      this.close();
      History.off('change', handleClose);
    };

    History.on('change', handleClose);
  }

  render() {
    return html`
      ${this._renderHeader()}
      <main>
        <s-project-list></s-project-list>
      </main>
      <aside>
        <s-text type="h4">Learn</s-text>
      </aside>
      <footer>
        <s-text type="h4">Explore</s-text>
      </footer>
    `;
  }

}
