import { css } from 'lit-element';
export default css`:host{--height: 4rem;position:fixed;top:0;padding:var(--margin);width:100%;height:6.1rem;background-color:var(--color-bg);z-index:10;user-select:none;border-bottom:0.1rem solid var(--color-line)}:host .wrapper{display:flex;height:var(--height);line-height:var(--height);align-items:center}:host:before,:host:after{content:'';position:absolute;bottom:calc(var(--margin) * -1);border-bottom:0.2rem solid var(--color-main);width:calc(var(--margin) * 5);height:0.25rem;opacity:0.3}:host:before{border-left:calc(var(--margin) * 2) solid var(--color-main);left:calc(var(--margin) * 9)}:host:after{border-right:calc(var(--margin) * 2) solid var(--color-main);right:calc(var(--margin) * 9)}:host *{position:relative;z-index:9999;box-sizing:border-box}:host .logo{--color: var(--color-main);flex-grow:0;height:calc(var(--height) * 1.5);width:calc(var(--height) * 1.5);line-height:calc(var(--height) * 1.5);text-align:center;font-size:0;margin-right:1rem}:host .logo svg{width:calc(var(--height));vertical-align:middle}:host header-project-owner{margin-right:auto}:host synthia-button.login{margin-left:auto}:host synthia-button.login a{vertical-align:top;line-height:2.7rem}:host synthia-button.login svg{height:2rem;--color: var(--color-bg)}:host synthia-button.login *{vertical-align:middle}:host .user{height:4rem;display:inline-flex;align-items:center;padding:1rem 1.5rem;border-radius:0.4rem;cursor:pointer;border:0.1rem solid transparent;margin-left:auto}:host .user::before{content:'';position:absolute;top:0;left:0;height:100%;width:100%;border-radius:0.4rem;background:var(--color-line);opacity:0.2}:host .user:hover,:host .user.active{background:var(--color-hover)}:host .user.active{border:0.1rem solid var(--color-line)}:host .user img{border-radius:50%;width:2rem;height:2rem;vertical-align:middle;margin-right:var(--margin)}:host .user span{vertical-align:middle;font-size:1.5rem}:host .user+synthia-context-menu{position:absolute;top:calc(var(--height) - 0.1rem);right:0}
`;
