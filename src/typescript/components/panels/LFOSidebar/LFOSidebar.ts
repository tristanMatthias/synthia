import { Sidebar, SidebarSide } from "../../layout/Sidebar/Sidebar";
import { html } from "lit-html";

export class LFOSidebar extends Sidebar {
  title = 'LFO Settings'
  type = SidebarSide.left;

  get _contents() {
    return html``;
  }
}
