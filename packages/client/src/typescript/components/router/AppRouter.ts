import { Router, Route } from "../layout/Router/Router";
import { customElement } from "lit-element";
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
  routes = ROUTES;
}
