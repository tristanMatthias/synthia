import { createBrowserHistory } from 'history';

import { EventObject } from './EventObject/EventObject';

export interface HistoryEvent {
  change: {
    path: string
  }
}

export const History = new class extends EventObject<HistoryEvent> {
  history = createBrowserHistory();
  constructor() {
    super();
    window.addEventListener('click', this._capture.bind(this));

    // Listen for changes to the current location.
    this.history.listen((location, action) => {
      this.emit('change', {path: location.pathname})
    });
  }

  push(path: string) {
    this.history.push(path);
  }
  replace(path: string) {
    this.history.replace(path);
  }

  _capture(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    // use shadow dom when available if not, fall back to composedPath()
    // for browsers that only have shady
    let el = e.target as HTMLElement;
    // @ts-ignore
    const eventPath = e.path || (e.composedPath ? e.composedPath() : null);

    if (eventPath) {
      for (let i = 0; i < eventPath.length; i++) {
        if (!eventPath[i].nodeName) continue;
        if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
        if (!eventPath[i].href) continue;

        el = eventPath[i];
        break;
      }
    }

    // continue ensure link
    // el.nodeName for svg links are 'a' instead of 'A'
    while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode as HTMLElement;
    if (!el || 'A' !== el.nodeName.toUpperCase()) return;

    // check if link is inside an svg
    // in this case, both href and target are always inside an object
    const a = el as HTMLAnchorElement;
    // @ts-ignore
    const svg = (typeof a.href === 'object') && a.href.constructor.name === 'SVGAnimatedString';

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    const link = a.getAttribute('href');
    // if (!this._hashbang && this._samePath(el) && (a.hash || '#' === link)) return;

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    // svg target is an object and its desired value is in .baseVal property
    // @ts-ignore
    if (svg ? a.target.baseVal : a.target) return;

    // x-origin
    // note: svg links that are not relative don't call click events (and skip page.js)
    // consequently, all svg links tested inside page.js are relative and in the same origin
    // if (!svg && !this.sameOrigin(a.href)) return;

    // rebuild path
    // There aren't .pathname and .search properties in svg links, so we use href
    // Also, svg href is an object and its desired value is in .baseVal property
    // @ts-ignore
    let path = svg ? a.href.baseVal : (a.pathname + a.search + (a.hash || ''));

    path = path[0] !== '/' ? '/' + path : path;

    // same page
    const orig = path;
    const pageBase = window.location.origin;

    if (path.indexOf(pageBase) === 0) {
      path = path.substr(pageBase.length);
    }

    // if (this._hashbang) path = path.replace('#!', '');

    if (pageBase && orig === path) {
      return;
    }

    e.preventDefault();
    this.history.push(path);
  };
}()
