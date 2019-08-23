import { css, customElement, html, LitElement } from 'lit-element';
import ptr from 'path-to-regexp';
import qs from 'query-string';
import { Context } from 'universal-router';

import { History } from '../../../lib/History';
import { SElement } from '../../../types';

// @ts-ignore
window.ptr = ptr;

interface BaseRoute {
  path: string
  applyContext?: boolean;
  enter?: (ctx: Context, ele: HTMLElement) => any
  exit?: (ctx: Context, ele: HTMLElement) => any
}

interface RouteHTML extends BaseRoute {
  html: string
}
interface RouteElement extends BaseRoute {
  element: string
}

export type Route = RouteElement | RouteHTML;


@customElement(SElement.router)
export class Router extends LitElement {

  static styles = [css`:host { display: block;}`]


  routes: Route[] = [];
  root = '';

  private _currentRoute?: Route;
  private _currentPage?: HTMLElement;
  protected _appendTo?: HTMLElement;


  connectedCallback() {
    super.connectedCallback();
    History.on('change', ({ path }) => this.load(path));
    this.load();
  }

  private _resolve(path: string, queryString?: string) {
    const route = this.routes.find(r =>
      ptr(r.path).test(path)
    );
    if (!route) throw new Error('Route not found');

    const keys: any[] = [];
    const r = ptr(route.path, keys).exec(location.pathname) || [];

    const params = keys.reduce((acc, key, i) => ({ [key.name]: r[i + 1], ...acc }), {});
    const query = queryString ? qs.parse(queryString) : {}

    return {
      route,
      params,
      query
    }
  }


  async load(path: string = document.location.pathname) {
    try {
      const { route, params, query } = await this._resolve(path, document.location.search);

      // Don't need to do anything as already on current page
      if (this._currentRoute === route) {
        this._applyContextToElement(params, query);
        return;
      }

      if (this._currentPage) this._currentPage.remove();

      let ele;
      if ((<RouteHTML>route).html) {
        ele = document.createElement('div');
        ele.classList.add('synthia-page');
        ele.innerHTML = (<RouteHTML>route).html;

      } else {
        ele = document.createElement((<RouteElement>route).element);
      }

      this._currentPage = ele;
      this._currentRoute = route;
      this._applyContextToElement(params, query);

      if (route.enter) route.enter({ params, query }, ele);
      if (this._appendTo) this._appendTo.appendChild(ele);
      else this.appendChild(ele);
    } catch (e) { }
  }


  private async _applyContextToElement(
    params: object,
    query: object
  ) {
    const r = this._currentRoute;
    const ele = this._currentPage;

    if (!r || !ele) throw new Error('Not initialized');

    if (r.applyContext !== false) {
      if ((<RouteHTML>r).html) {
        if (ele.childElementCount !== 1) console.error('Can only apply context to html with one root element.');
        Object.assign(ele.firstChild, params);
        Object.assign(ele.firstChild, query);
      } else {
        Object.assign(ele, params);
        Object.assign(ele, query);
      }
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
