import { css } from 'lit-element';
export default css`:host{display:block;position:fixed;box-sizing:content-box;user-select:none;top:calc(var(--margin) * 2);right:calc(var(--margin) * 2);bottom:calc(var(--margin) * 2);width:32rem;background-color:var(--color-bg-off);border:1px solid var(--color-main);overflow-y:auto}:host:before,:host:after{--size: 0.5rem;content:'';position:absolute;box-sizing:border-box;height:var(--size);width:calc(100% + var(--size));margin-left:calc(var(--size)/-2);margin-top:calc(var(--size)/-2);border-left:var(--size) solid var(--color-main);border-right:var(--size) solid var(--color-main)}:host:after{bottom:calc(var(--size) / -2)}:host header{display:flex;position:relative;top:0;left:0;height:4rem;width:100%}:host header:before{content:'';position:absolute;top:0;left:0;height:100%;width:100%;background:var(--color-main);opacity:0.1;z-index:-1}:host header h2{flex:1;font-size:1.8rem;letter-spacing:1px;line-height:4rem;margin:0;margin-left:1rem;font-weight:normal}:host header span{flex-grow:0;display:inline-block}:host header span svg{height:4rem;width:4rem;--color: var(--color-main);cursor:pointer;transition:all 0.2s}:host header span svg:hover{--color: var(--color-alt)}:host main{padding:0 var(--margin)}:host *{box-sizing:border-box}:host synthia-frequency-response{margin-left:calc(-1 * var(--margin))}:host form{margin-top:var(--margin);display:grid;grid-template-columns:1fr 1fr;grid-gap:2rem 0}:host form .form-row{grid-column:span 2;display:flex;flex-wrap:wrap;align-items:center}:host form .form-row label{flex:1;flex-basis:100%}:host form .form-row synthia-slider,:host form .form-row synthia-expo-slider{flex-grow:1}:host form .form-row .value{flex-grow:0;display:inline-block;height:4rem;line-height:4rem;width:8rem;padding:0 1rem;margin-left:var(--margin);text-align:center;border-radius:0.4rem;color:var(--color-alt);background:var(--color-bg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host form .form-col{grid-column:span 1;text-align:center}:host form .form-col label{display:block}:host form .form-col synthia-dial{margin-top:1rem}:host select{height:4rem;border:1px solid var(--color-main);background:none;border-radius:0.4rem;width:100%;margin:var(--margin) 0;outline:none;transition:all 0.2s}:host select,:host select option{color:var(--color-text);font-family:var(--font-family);font-size:1.4rem}:host select:focus{border-color:var(--color-alt);background:var(--color-dark)}
`;
