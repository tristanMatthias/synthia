import { Router, Route } from "../layout/Router/Router";
import { customElement } from "lit-element";
import { SElement } from "../../types";

const templateSynth = `<synthia-page-synth>
  <synthia-waveform class="main"></synthia-waveform>
  <synthia-keyboard></synthia-keyboard>
  <synthia-toaster></synthia-toaster>
  <synthia-side-menu></synthia-side-menu>
</synthia-page-synth>`;

const templateOAuth = `<synthia-page-oauth></synthia-page-oauth>`;
const templateNotFound = `Page not found`;


const ROUTES: Route[] = [
  {
    path: '/oauth/:provider',
    html: templateOAuth
  },
  {
    path: '/',
    html: templateSynth
  },
  {
    path: '(.*)',
    html: templateNotFound
  },
]


@customElement(SElement.appRouter)
export class AppRouter extends Router {
  routes = ROUTES;
}
