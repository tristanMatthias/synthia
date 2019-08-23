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
        <synthia-project-list></synthia-project-list>
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
