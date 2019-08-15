import { css } from 'lit-element';
export default css`:host{--tile-size: 7rem;position:fixed;left:var(--margin);top:calc(var(--margin) * 7);bottom:calc(var(--margin) * 1);width:var(--tile-size);border-right:0.1rem solid var(--color-line);display:grid;padding-top:4rem;grid-template-columns:var(--tile-size);grid-auto-rows:var(--tile-size);align-items:center;justify-content:center}:host>div:first-of-type{border-top:0.1rem solid var(--color-dark)}:host>div:last-of-type{border-bottom:0.1rem solid var(--color-dark)}:host div.button+div.drag{border-top:0.1rem solid var(--color-dark)}:host div{position:relative;text-align:center;line-height:var(--tile-size);transition:all 0.2s;cursor:grab;user-select:none}:host div svg{width:4rem;display:inline-block;vertical-align:middle;transition:all 0.2s ease-out}:host div svg *{stroke-width:0.2rem}:host div.button svg{--color: var(--color-white)}:host div.drag svg{--color: var(--color-alt)}:host div span{position:absolute;top:50%;right:-2rem;transform:translate(100%, -50%);visibility:hidden;opacity:0;transition:all 0.2s;pointer-events:none;height:3rem;line-height:3rem;padding:0 1rem;white-space:nowrap;text-align:center;background:var(--color-hover);border-radius:1.5rem}:host div:hover{background:var(--color-hover)}:host div:hover span{visibility:visible;opacity:1;right:-1rem}:host div:hover svg{transform:scale(1.2)}
`;