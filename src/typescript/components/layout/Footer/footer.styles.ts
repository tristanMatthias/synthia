import { css } from 'lit-element';
export default css`:host{position:fixed;bottom:0;left:var(--margin);right:var(--margin);height:8rem;padding-bottom:1rem;display:grid;grid-template-columns:repeat(6, 6rem);align-items:center;justify-content:center}:host:before,:host:after{content:'';position:absolute;bottom:calc(1/3 * var(--margin));border-top:2px solid var(--color-main);width:8rem;height:0.5rem;opacity:0.3}:host:before{border-left:3rem solid var(--color-main);left:0}:host:after{border-right:3rem solid var(--color-main);right:0}:host>svg{position:fixed;bottom:0;left:50%;transform:translateX(-50%);opacity:0.5;z-index:-1}:host div{text-align:center;line-height:6rem;transition:all 0.2s;cursor:grab;user-select:none}:host div svg{width:4rem;display:inline-block;vertical-align:middle;--color: var(--color-alt)}:host div svg *{stroke-width:0.2rem}:host div span{position:absolute;left:50%;top:-3rem;transform:translate(-50%);visibility:hidden;opacity:0;transition:all 0.2s;height:3rem;max-width:150%;line-height:3rem;padding:0 1rem;text-align:center;background:var(--color-hover);border-radius:1.5rem}:host div:hover{background:var(--color-hover)}:host div:hover svg{--color: var(--color-alt)}:host div:hover span{visibility:visible;opacity:1}
`;
