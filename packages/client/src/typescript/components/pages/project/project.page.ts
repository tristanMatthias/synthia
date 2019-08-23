import { css, customElement, html, property } from 'lit-element';

import { fileService } from '../../../lib/File/FileService';
import { History } from '../../../lib/History';
import { SElement } from '../../../types';
import { Route, Router } from '../../layout/Router/Router';
import { project } from '../../../lib/Project/Project';


const templateSynth = `<s-page-synth>
  <s-waveform class="main"></s-waveform>
  <s-keyboard></s-keyboard>
  <s-toaster></s-toaster>
  <s-side-menu></s-side-menu>
</s-page-synth>`;


const ROUTES: Route[] = [
  {
    path: '/project/:projectId/synth/:synthId',
    html: templateSynth
  },
  {
    path: '/project/:projectId',
    element: SElement.projectHomePage
  },
]

export * from './projectHome/ProjectHome.page';

@customElement(SElement.projectPage)
export class PageProject extends Router {

  static styles = [
    ...Router.styles,
    css`
      :host {
        display: block;
        margin-top: 8rem;
        --footer-height: var(--header-height);
      }
      .loading {
        color: var(--color-main);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      ::slotted(*) {
        position: absolute;
        top: 0;
        bottom: var(--footer-height);
        left: 0;
        width: 100%;
        overflow-y: auto;
      }
    `
  ];

  routes = ROUTES;

  private _projectId : string;
  public get projectId() : string {
    return this._projectId;
  }
  public set projectId(v : string) {
    this._projectId = v;
    this._load();
  }


  @property({ reflect: true, type: Boolean })
  private loading = true;

  render() {
    if (this.loading) return html`<div class="loading">
      <s-loading></s-loading>
      Loading…
    </div>`;

    return html`
      <slot></slot>
      <s-project-footer></s-project-footer>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    project.close();
  }


  private async _load() {
    try {
      await fileService.load(this.projectId);
      this.loading = false;
      await this.updateComplete;
    } catch (e) {
      History.replace('/404');
      this.remove();
      return;
    }
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.projectPage]: PageProject;
  }
}




