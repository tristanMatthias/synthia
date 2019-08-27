import { customElement, html, LitElement } from 'lit-element';

import { project } from '../../../../lib/Project/Project';
import { SElement } from '../../../../types';
import styles from './project-home.styles';

export * from './Browser/Browser';
export * from './TrackList/TrackList';
export * from './TrackList/Track/Track';

@customElement(SElement.projectHomePage)
export class PageProjectHome extends LitElement {

  static styles = [styles];

  constructor() {
    super();
    project.on('loadedNewProject', () => this.requestUpdate());
  }

  render() {
    if (!project.file) return html``;

    return html`
      <s-browser></s-browser>
      <main>
        <s-track-list></s-track-list>
      </main>
    `
  }

}
