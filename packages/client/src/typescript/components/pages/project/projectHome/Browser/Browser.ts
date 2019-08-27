import { customElement, html, LitElement } from 'lit-element';

import styles from './browser.styles';
import { project } from '../../../../../lib/Project/Project';
import { ESynth } from '@synthia/api';



@customElement('s-browser')
export class Browser extends LitElement {
  static styles = [styles];

  render() {
    return html`
      <aside>
        <header>
          <s-button icon="collapsed" hollow small color="main"></s-button>
          <s-text type="h4">Browser</s-text>
        </header>
        <nav>
          <span class="active"><s-icon type="synth" style="--stroke-width: 0.2rem"></s-icon><s-text>Synths</s-text></span>
        </nav>
      </aside>
      <div class="results">
        <ul>
          ${project.file!.resources.synths.map((s, i) => html`<li><a
              title=${s.name}
              href=${`/project/${project.file!.id}/synth/${s.id}`}
              style="animation-delay: ${Math.log(i + 1) / 5}s"
              @dragstart=${(e: any) => this._startDrag(e, s)}
              draggable="draggable"
            > ${s.name} </a></li>`)}
        </ul>
      </div>
    `;
  }

  private _startDrag(e: DragEvent, synth: ESynth) {
    e.dataTransfer!.setData('instrument', synth.id);
  }
}
