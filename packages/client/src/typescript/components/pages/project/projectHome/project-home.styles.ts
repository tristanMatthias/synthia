import { css } from 'lit-element';
export default css`:host{display:grid;grid-template-columns:30rem 1fr}:host main{position:relative;padding:calc(var(--margin) * 2)}:host s-text[type=h4]{margin-bottom:2rem}:host .synths{max-width:80rem;margin-top:4rem;margin:auto;background:var(--color-bg-off);padding:2rem;border-radius:0.4rem;display:grid;grid-template-columns:repeat(4, 1fr);grid-gap:calc(var(--margin) * 2)}:host s-from-now{display:block;font-size:1.2rem;color:var(--color-main)}:host a{text-decoration:none;color:var(--color-text);opacity:0;animation:slide-up ease-out 0.7s forwards}:host a,:host a s-card,:host a *{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transition:all 0.07s}:host a:hover s-card{background:var(--color-hover);color:var(--color-alt)}:host .bottom-panel{position:absolute;bottom:0;left:0;width:100%;height:30rem;border-top:0.5rem solid var(--color-line)}@keyframes slide-up{from{transform:translateY(2rem);opacity:0}to{transform:translateY(0);opacity:1}}
`;
