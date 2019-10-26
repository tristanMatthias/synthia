import { css } from 'lit-element';
export default css`:host{position:absolute;width:var(--clip-width);--color: var(--clip-color, var(--color-text));--color-selected: var(--clip-selected, var(--color-text-alt))}:host header{height:var(--clip-height);background:var(--color);border-left:0.1rem solid var(--color-bg);border:0.1rem solid var(--color-bg);box-sizing:border-box;cursor:grab;outline:none;font-size:1.2rem;color:var(--color-black);line-height:calc(var(--clip-height) * 0.9);padding:0 0.7rem;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host header:before,:host header:after{content:'';position:absolute;width:0.5rem;top:0;height:var(--clip-height);background:var(--color-bg);opacity:0.3}:host header:before{left:0;cursor:w-resize}:host header:after{cursor:e-resize;right:0}:host([selected]) header{background:var(--color-selected)}
`;
