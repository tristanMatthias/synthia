import { css } from 'lit-element';
export default css`:host{position:fixed;bottom:0;left:0;width:100%;height:var(--footer-height);border-top:0.1rem solid var(--color-line);background:var(--color-bg-off);opacity:0;animation:slide-up ease-out 0.2s forwards}:host,:host *{box-sizing:border-box}@keyframes slide-up{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
`;
