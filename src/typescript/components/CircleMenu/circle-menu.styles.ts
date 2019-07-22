import { css } from 'lit-element';
export default css`:host{position:absolute;left:0;top:0;height:100%;width:100%}:host div{position:absolute;top:50%;width:80%;right:50%;transform-origin:right center}:host span{display:inline-block;transition:all 0.15s ease-out;margin-left:2rem;opacity:0;transform:scale(0.5)}:host([open="true"]) span{margin-left:0;visibility:visible;opacity:1;transform:scale(1);transition:all 0.25s ease-out}@keyframes showButton{from{}to{}}
`;
