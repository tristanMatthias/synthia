import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';

import { iconClose } from '../../icons/close';
import { iconError } from '../../icons/error';
import { iconInfo } from '../../icons/info';
import { iconWarning } from '../../icons/warning';
import { SElement } from '../../types';
import styles from './toaster.styles';

export type NotificationType = 'info' | 'warning' | 'error';

export interface NotificationOptions {
  text: string,
  icon?: TemplateResult | true
  closable?: boolean
}


interface Notification extends NotificationOptions {
  id: number,
  type: NotificationType,
  created: number
}

const icons = {
  info: iconInfo,
  warning: iconWarning,
  error: iconError
}

@customElement(SElement.toaster)
export class Toaster extends LitElement {

  static styles = [styles]

  @property()
  private _notifications: Notification[] = [];

  private _idSum: number = 0;
  private _closed: number[] = [];

  render() {
    const notifications = this._notifications.map(n => {
      let c = n.type;
      if (this._closed.includes(n.id)) c += ' closing';
      return html`
        <div class=${c} id="n-${n.id}">
          <span> ${n.icon} ${n.text}</span>
          <span class="icon close" @click=${() => this.close(n.id)}>
            ${iconClose}
          </span>
        </div><br>
      `
    })


    return html`${notifications}`;
  }


  info(notification: NotificationOptions | string) {
    return this._create('info', notification);
  }

  warning(notification: NotificationOptions | string) {
    return this._create('warning', notification);
  }

  error(notification: NotificationOptions | string) {
    return this._create('error', notification);
  }


  close(id: number) {
    // Already closing
    if (this._closed.includes(id)) return true;

    const n = this._notifications.find(n => n.id == id);
    if (!n) throw new Error('No notification found');

    this._closed.push(id);
    this.requestUpdate();

    // Wait for transition to end, then remove it
    const ele = this.shadowRoot!.getElementById(`n-${id}`)!;

    ele.addEventListener('animationend', (e) => {
      if (e.target === ele) {
        ele.remove();
      }
    });
  }


  private _create(type: NotificationType, options: NotificationOptions | string) {
    let o = options;
    if (typeof o === 'string') o = { text: o };

    const n: Notification = {
      id: this._idSum,
      type,
      ...o,
      created: Date.now()
    };
    if (n.icon === true || n.icon === undefined) n.icon = icons[type];


    this._idSum += 1;


    this._notifications.push(n);
    this.requestUpdate();

    return n;
  }


  connectedCallback() {
    super.connectedCallback();
    this._garbageCollection();
  }


  private _garbageCollection() {
    // 5 second life
    const life = 5;
    this._notifications.forEach(n => {
      if (n.created) {
        if ((Date.now() - n.created) / 1000 > life) this.close(n.id);
      }
    })
    window.requestAnimationFrame(this._garbageCollection.bind(this));
  }
}


declare global {
  interface HTMLElementTagNameMap {
    [SElement.toaster]: Toaster;
  }
}
