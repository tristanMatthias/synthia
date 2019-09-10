import { customElement, html, LitElement } from 'lit-element';

import styles from './browser.styles';
import { project } from '../../../../../lib/Project/Project';
import { ESynth } from '@synthia/api';
import { SElement } from '../../../../../types';
import { Icon } from '../../../../ui/Icon/Icon';
import { History } from '../../../../../lib/History';

export enum BrowserEvents {
  draggingSynth = 'draggingSynth'
}


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
          ${project.file!.resources.synths.map((s) => html`<li
            @dragstart=${(e: any) => this._startDrag(e, s)}
            draggable="true"
          >
            ${s.name}
            <div class="icons">
              <s-icon
                title="Open synth"
                type="edit"
                @click=${() => History.push(`/project/${project.file!.id}/synth/${s.id}`)}
              ></s-button>
            </div>
          </li>`)}
        </ul>
      </div>
    `;
  }


  private _startDrag(e: DragEvent, synth: ESynth) {
    e.dataTransfer!.setData('instrument', synth.id);
    const icon = document.createElement(SElement.icon) as Icon;
    icon.type = 'synth';
    icon.style.position = "absolute";
    icon.style.top = "-1000px";
    icon.style.borderRadius = '50%';
    icon.style.background = 'var(--color-hover)';
    icon.style.padding = '0 1rem';
    icon.style.opacity = '1';
    icon.style.setProperty('--stroke-width', '0.2rem');
    icon.style.setProperty('--color', 'var(--color-alt)');
    document.body.appendChild(icon);
    e.dataTransfer!.setDragImage(icon, 0, 0);
    this.dispatchEvent(new CustomEvent(BrowserEvents.draggingSynth));
  }
}
