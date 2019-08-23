import { Router, Route } from "../layout/Router/Router";
import { customElement, css } from "lit-element";
import { SElement } from "../../types";


const ROUTES: Route[] = [
  {
    path: '/oauth/:provider',
    element: SElement.oauthPage
  },
  {
    path: '/project/:projectId/(.*)?',
    element: SElement.projectPage
  },
  {
    path: '/',
    element: SElement.homePage
  },
  {
    path: '(.*)',
    html: 'Page not found'
  },
]


@customElement(SElement.appRouter)
export class AppRouter extends Router {
  static styles = [
    css`
      :host {
        display: block;
        position: fixed;
        top: var(--header-height);
        left: 0;
        width: 100%;
        bottom: 0;
      }
      ::slotted(*) {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow-y: auto;
      }
    `
  ];

  routes = ROUTES;
}
