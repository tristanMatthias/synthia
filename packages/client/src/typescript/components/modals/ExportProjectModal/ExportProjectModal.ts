import { customElement, property } from 'lit-element';
import { html } from 'lit-html';

import { Clock } from '../../../lib/Clock';
import { Exporter } from '../../../lib/Exporter';
import { project } from '../../../lib/Project/Project';
import { SElement } from '../../../types';
import { Modal } from '../../ui/Modal/Modals';
import { Progress } from '../../ui/Progress/Progress';
import styles from './export-project.styles';

@customElement(SElement.modalExportProject)
export class OpenProjectModal extends Modal {

  static styles = [
    ...Modal.styles,
    styles
  ]

  heading = `Export "${project.file!.name}" project`;

  @property()
  loading: boolean = false;

  progress: Progress;

  constructor() {
    super();
    this._update = this._update.bind(this);
    this.close = this.close.bind(this);
    Exporter.on('cancelled', this.close);
    Exporter.on('finished', this.close);
  }

  disconnectedCallback() {
    if (Exporter.exporting && !Exporter.finished) Exporter.cancel();
    super.disconnectedCallback();
    Exporter.off('cancelled', this.close);
    Exporter.off('finished', this.close);
  }

  render() {
    return html`
      <main>
        <s-text type="h3">${this.heading}</s-text>
        ${this.loading ? html`<div class="progress">
          <span> ${Math.round(Exporter.duration! - Clock.currentTime)}s left</span>
          <s-progress></s-progress>
        </span>` : null
      }
      </main>
      <footer class="buttons">
        <s-button hollow color="main" @click=${this.close.bind(this)}>Cancel</s-button>
        <s-button .loading=${this.loading} @click=${this.export}>Export</s-button>
      </footer>
    `;
  }

  async export() {
    Exporter.export(4);
    this.loading = true;
    this.heading = 'Exporting project…';
    await this.updateComplete;

    this.progress = this.shadowRoot!.querySelector(SElement.progress)!;
    this._draw();
  }

  private _draw() {
    if (!Exporter.exporting || !Exporter.duration || !this.progress) return;
    this.progress.percentage = Clock.currentTime / Exporter.duration * 100;
    window.requestAnimationFrame(this._draw.bind(this));
    this.requestUpdate();
  }

  private _update() {
    this.requestUpdate();
  }

}
