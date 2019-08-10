import { css } from 'lit-element';
export default css`:host{display:none;border:0.1rem solid var(--color-line);position:absolute;background:var(--color-bg-off);border-radius:0.4rem}:host div{transition:all 0.05s;font-size:1.5rem;height:3rem;line-height:3rem;padding:0 2rem;cursor:pointer}:host div:hover{background:var(--color-hover);color:var(--color-alt)}:host-context([show]){display:block}::slotted(div){transition:all 0.05s;font-size:1.5rem;height:3rem;line-height:3rem;padding:0 2rem;cursor:pointer}::slotted(div:hover){background:var(--color-hover);color:var(--color-alt)}
`;
