import { css, customElement, html, LitElement } from 'lit-element';
import UniversalRouter, { Context } from 'universal-router';
import qs from 'query-string';

import { History } from '../../../lib/History';
import { SElement } from '../../../types';

export interface Route {
  path: string,
  html: string,
  applyContext?: boolean;
  enter?: (ctx: Context, ele: HTMLElement) => any
  exit?: (ctx: Context, ele: HTMLElement) => any
}


@customElement(SElement.router)
export class Router extends LitElement {

  static get styles() {
    return [css`:host { display: block;}`]
  }

  routes: Route[] = [];
  root = '';

  private _currentPage?: HTMLElement;
  private _router: UniversalRouter<any, HTMLElement>
  protected _appendTo?: HTMLElement;

  constructor() {
    super();
    this._router = new UniversalRouter([]);
  }

  connectedCallback() {
    super.connectedCallback();
    History.on('change', ({path}) => this.load(path));
    this.loadPages();
    this.load();
  }

  loadPages() {
    this._router = new UniversalRouter({
      path: this.root,
      children: this.routes.map(r => ({
        path: r.path,
        action: (ctx, _params) => {
          const ele = document.createElement('div');
          ele.classList.add('synthia-page');
          ele.innerHTML = r.html;

          if (r.applyContext !== false) {
            if (ele.childElementCount !== 1) console.error('Can only apply context to html with one root element');
            Object.assign(ele.firstChild, ctx.params);
            Object.assign(ele.firstChild, ctx.query);
          }

          if (r.enter) r.enter(ctx, ele);
          return ele;
        }
      }))
    })
  }


  async load(path: string = document.location.pathname) {
    try {
      const ele = await this._router.resolve({
        pathname: path,
        query: qs.parse(document.location.search)
      });

      if (ele && this._currentPage) this._currentPage.remove();
      this._currentPage = ele;
      if (this._appendTo) this._appendTo.appendChild(ele);
      else this.appendChild(ele);
    } catch (e) {
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
