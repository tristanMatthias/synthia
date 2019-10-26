import { css } from 'lit-element';
export default css`:host{height:100%;--color-note: var(--color-text);--color-selected: var(--color-alt)}:host:before{position:absolute;top:var(--clip-height);left:0.1rem;width:calc(100% - 0.2rem);height:calc(100% - var(--clip-height))}:host canvas{position:absolute;top:calc(var(--clip-height) + 1rem);left:0.1rem;width:calc(100% - 0.2rem);height:calc(100% - var(--clip-height) - 2rem)}:host:before{content:'';background:var(--color-note);opacity:0.1}:host([selected]){--color-note: var(--color-alt)}
`;
