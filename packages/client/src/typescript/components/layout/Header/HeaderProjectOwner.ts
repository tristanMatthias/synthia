import { css, customElement, html, LitElement } from 'lit-element';

import { model } from '../../../lib/Model/Model';
import { FileBarOptions } from '../../ui/FileBar/FileBar';
import { SElement } from '../../../types';
import { fileService } from '../../../lib/File/FileService';

@customElement('header-project-owner')
export class ProjectHeader extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        text-align: left;
        margin-right: auto;
        height: 6rem;
      }

      project-name {
        margin-left: 1rem;
        opacity: 0;
        animation: slide-up 0.1s forwards;
      }

      synthia-file-bar {
        flex-basis: 100%;
        opacity: 0;
        animation: slide-up 0.1s 0.07s forwards;
      }

      @keyframes slide-up {
        from { transform: translateY(1rem); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
  ]

  app = document.querySelector(SElement.app)!;

  private _fileBarOptions: FileBarOptions = {
    'File': [
      {
        action: () => this.app.modal.open(SElement.modalOpenProject),
        text: 'Open project'
      },
      {
        action: () => this.app.modal.open(SElement.modalCreateProject),
        text: 'New project'
      },
      {
        action: () => fileService.openFile(),
        text: 'Import .synth file'
      },
      {
        action: () => fileService.download(),
        text: 'Download'
      }
    ]
  }

  render() {
    const file = model.file!;
    return html`
      <project-name .value=${file.name}></project-name>
      <synthia-file-bar .options=${this._fileBarOptions}></synthia-file-bar>
    `;
  }
}