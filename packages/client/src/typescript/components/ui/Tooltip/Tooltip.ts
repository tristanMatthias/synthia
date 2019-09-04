import {
  customElement,
  html,
  LitElement,
  property
} from 'lit-element';
import styles from './tooltip.styles';
import { SElement } from '../../../types';

export type TooltipPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'top-right'
  | 'left-bottom'
  | 'left'
  | 'left-top';

@customElement(SElement.tooltip)
export class Tooltip extends LitElement {
  static styles = [styles];

  @property({ reflect: true })
  public position: TooltipPosition = 'top';

  private _parent: Tooltip | null = null;
  private _clone: Tooltip | null = null;

  constructor() {
    super();
    this._update = this._update.bind(this);
    this._remove = this._remove.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  public connectedCallback() {
    super.connectedCallback();
    this._update();
    window.addEventListener('scroll', this._update);
    window.addEventListener('resize', this._update);
  }

  public disconnectedCallback() {
    window.removeEventListener('scroll', this._update);
    window.removeEventListener('resize', this._update);
    super.disconnectedCallback();
  }

  @property({ reflect: true, type: Boolean })
  showing: boolean = false;

  @property()
  get for(): HTMLElement | null {
    if (typeof this._for === 'string') {
      return document.querySelector(`#${this._for}`);
    } else return this._for || null;
  }
  set for(v) {
    if (v && this._for !== v) {
      if (this.for) this._removeHandlers(this.for);
      this._for = v;
      if (this.for) this._addHandlers(this.for);
      this._update();
    }
  }
  private _for?: string | HTMLElement;


  public render() {
    return html`<slot></slot>`;
  }

  protected updated() {
    this._update();
  }


  show() {
    if (this._parent) return;
    this._clone = this.cloneNode(true) as Tooltip;
    this._clone._parent = this;
    this._clone.showing = true;
    document.body.appendChild(this._clone);
  }

  hide() {
    if (!this._clone) return;
    this._clone.remove();
  }


  private _update() {
    if (!this.for || !this.position) {
      // this.show = false;
      return;
    }

    const { x, y, width, height } = this.for.getBoundingClientRect() as DOMRect;

    if (/^left$/.test(this.position)) {
      this.style.left = `${parseInt(x.toString(), 10)}px`;
    } else if (/^right$/.test(this.position)) {
      this.style.left = `${parseInt((x + width).toString(), 10)}px`;
    } else {
      this.style.left = `${parseInt((x + width / 2).toString(), 10)}px`;
    }

    if (/^top$/.test(this.position)) {
      this.style.top = `${parseInt(y.toString(), 10)}px`;
    } else if (/^bottom$/.test(this.position)) {
      this.style.top = `${parseInt((y + height).toString(), 10)}px`;
    } else {
      this.style.top = `${parseInt((y + height / 2).toString(), 10)}px`;
    }
  }

  private _remove(e: KeyboardEvent | MouseEvent) {
    if (e instanceof KeyboardEvent && e.key !== 'Escape') return;

    window.removeEventListener('keydown', this._remove);
    window.removeEventListener('click', this._remove);
    this.remove();
  }

  private _addHandlers(ele: HTMLElement) {
    ele.addEventListener('mouseenter', this.show);
    ele.addEventListener('mouseleave', this.hide);
  }

  private _removeHandlers(ele: HTMLElement) {
    ele.addEventListener('mouseenter', this.show);
    ele.addEventListener('mouseleave', this.hide);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SElement.tooltip]: Tooltip;
  }
}
