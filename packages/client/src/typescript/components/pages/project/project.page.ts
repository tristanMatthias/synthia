import { css, customElement, html, property } from 'lit-element';

import { fileService } from '../../../lib/File/FileService';
import { History } from '../../../lib/History';
import { SElement } from '../../../types';
import { Route, Router } from '../../layout/Router/Router';


const templateSynth = `<synthia-page-synth>
  <synthia-waveform class="main"></synthia-waveform>
  <synthia-keyboard></synthia-keyboard>
  <synthia-toaster></synthia-toaster>
  <synthia-side-menu></synthia-side-menu>
</synthia-page-synth>`;


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
      }
      .loading {
        color: var(--color-main);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `
  ];

  routes = ROUTES;
  projectId: string;

  @property({ reflect: true, type: Boolean })
  private loading = true;

  render() {
    const root = super.render();
    if (this.loading) return html`<div class="loading">
      <synthia-loading></synthia-loading>
      Loading…
    </div>`;
    else return root;
  }

  async firstUpdated() {
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




