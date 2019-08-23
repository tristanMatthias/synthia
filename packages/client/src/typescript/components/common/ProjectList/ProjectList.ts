import { customElement, html, LitElement, TemplateResult } from 'lit-element';
import { until } from 'lit-html/directives/until';

import { fileService } from '../../../lib/File/FileService';
import { SElement } from '../../../types';
import styles from './project-list.styles';


@customElement(SElement.projectList)
export class ProjectList extends LitElement {
  static styles = [styles];

  projects: Promise<TemplateResult[]>

  async connectedCallback() {
    super.connectedCallback();
    this.projects = fileService.list().then(pjs =>
      pjs.map((pj, i) => html`<a
          title=${pj.name}
          href=${`/project/${pj.id}`}
          style="animation-delay: ${Math.log(i + 1) / 5}s"
        ><s-card>
          ${pj.name}
          <s-from-now .time=${pj.createdAt}></s-from-now>
        </s-card></a>`
      )
    );
  }

  render() {
    return html`
      <s-text type="h4">My projects</s-text>

      ${until(this.projects, html`<div class="loading">
        <s-loading></s-loading>
        <span>Loading projects…</span>
      </div>`)}`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.projectList]: ProjectList;
  }
}
