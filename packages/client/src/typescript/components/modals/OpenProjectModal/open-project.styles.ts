import { css } from 'lit-element';
export default css`:host{width:calc(100vw - var(--margin) * 8);height:calc(100vh - var(--margin) * 8);display:grid;grid-template-columns:4fr 32rem;grid-template-rows:calc(var(--modal-header-height) * 1.5) 1fr 16rem}:host header{height:calc(var(--modal-header-height) * 1.5);grid-column:span 2;border-bottom:0.1rem solid var(--color-line)}:host footer{height:auto;border-top:0.1rem solid var(--color-line);display:block}:host .loading{color:var(--color-line);position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);text-align:center}:host main,:host footer,:host aside{position:relative;grid-column:span 1;padding:calc(var(--margin) * 2)}:host aside{background:var(--color-dark);grid-row:span 2;border-left:0.1rem solid var(--color-line)}:host h4{font-weight:normal;font-size:1.4rem;text-transform:uppercase;color:var(--color-main);margin:0}:host synthia-from-now{display:block;font-size:1.2rem;color:var(--color-main)}:host .projects{margin-top:2rem;display:grid;grid-template-columns:repeat(4, 1fr);grid-gap:calc(var(--margin) * 2)}:host .projects a{text-decoration:none;color:var(--color-text);opacity:0;animation:slide-up ease-out 0.7s forwards}:host .projects a,:host .projects a synthia-card,:host .projects a *{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transition:all 0.07s}:host .projects a:hover synthia-card{background:var(--color-hover);color:var(--color-alt)}@keyframes slide-up{from{transform:translateY(2rem);opacity:0}to{transform:translateY(0);opacity:1}}
`;
