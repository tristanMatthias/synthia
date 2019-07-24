import { css } from 'lit-element';
export default css`:host{display:block;position:relative}:host:before,:host:after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;transition:all 0.2s ease-out}:host:before{background:linear-gradient(to right, transparent, var(--color-hover), transparent)}:host:after{background:url(/images/cut.svg) no-repeat center center;background-size:3rem;margin-left:-2rem}:host(:hover):before{opacity:1}:host(:hover):after{opacity:1;margin-left:0;cursor:pointer}:host(:not([removable])){pointer-events:none}
`;
