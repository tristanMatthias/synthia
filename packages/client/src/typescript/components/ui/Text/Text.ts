import { LitElement, property, html, customElement } from "lit-element";
import styles from './text.styles';
import { SElement } from "../../../types";

export type TextType =
  'text' |
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' |
  'p';

@customElement(SElement.text)
export class Text extends LitElement {
  static styles = [styles];

  @property({type: String, reflect: true})
  type?: TextType;

  render() {
    return html`<slot></slot>`;
  }
}
