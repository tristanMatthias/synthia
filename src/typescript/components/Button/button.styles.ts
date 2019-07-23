import { css } from 'lit-element';
export default css`:host{position:relative;display:inline-block;text-align:center;border-radius:50%;background:var(--color, var(--color-alt));transition:all 0.2s;cursor:pointer;user-select:none}:host:before{content:'';position:absolute;box-sizing:border-box;top:0;left:0;width:100%;height:100%;border-radius:50%;border:1px solid var(--color, var(--color-alt));transition:all 0.2s}:host(:hover){transform:scale(0.8);opacity:0.9}:host(:hover):before{transform:scale(1.4)}:host(:active){transform:scale(0.7);opacity:0.9}:host(:active):before{transform:scale(1.3)}
`;
