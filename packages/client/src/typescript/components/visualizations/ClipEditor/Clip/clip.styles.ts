import { css } from 'lit-element';
export default css`:host{position:absolute;width:var(--clip-width)}:host header{height:var(--clip-height);background:var(--color-alt);border-left:0.1rem solid var(--color-bg);border:0.1rem solid var(--color-bg);box-sizing:border-box;cursor:grab}:host header:before,:host header:after{content:'';position:absolute;width:0.5rem;height:100%;background:var(--color-bg);opacity:0.3}:host header:before{cursor:w-resize}:host header:after{cursor:e-resize;right:0}:host([selected]) header{background:var(--color-accent)}
`;
