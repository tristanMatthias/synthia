import { css } from 'lit-element';
export default css`:host{position:absolute;display:block;width:12rem;height:12rem}:host svg{overflow:visible;width:100%;--color: var(--color-main)}:host .icon{position:absolute;left:50%;top:50%;width:4rem;transform:translate(-50%, -50%)}:host .icon svg *{fill:none;stroke:var(--color-text)}:host synthia-waveform{position:absolute;top:50%;left:50%;transform-origin:left center;transform:translateY(-50%);pointer-events:none;opacity:0.2}:host synthia-waveform.playing{opacity:1}:host synthia-button{width:3rem;height:3rem;line-height:3rem}:host synthia-button svg,:host synthia-button svg *{fill:none;stroke:var(--color-bg)}
`;
