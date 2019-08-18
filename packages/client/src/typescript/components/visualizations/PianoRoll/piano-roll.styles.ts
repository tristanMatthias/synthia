import { css } from 'lit-element';
export default css`:host{--note-height: 2rem;--note-width: 2rem;--key-width: 8rem;--bg-white: rgba(165,153,233,0.01);--bg-b: rgba(165,153,233,0.02);position:relative;display:grid;user-select:none;overflow-y:auto}:host,:host *{box-sizing:border-box}:host div{--divider: rgba(165,153,233,0.05);--divider-strong: rgba(165,153,233,0.2);--bg-size: calc(var(--note-width) * 8);display:grid;height:var(--note-height);line-height:var(--note-height);border-bottom:0.1rem solid var(--divider);background-image:linear-gradient(to right, transparent calc((var(--bg-size) * 1/8) - 1px), var(--divider) calc((var(--bg-size) * 1/8)), transparent calc((var(--bg-size) * 1/8) + 1px), transparent calc((var(--bg-size) * 2/8) - 1px), var(--divider) calc((var(--bg-size) * 2/8)), transparent calc((var(--bg-size) * 2/8) + 1px), transparent calc((var(--bg-size) * 3/8) - 1px), var(--divider) calc((var(--bg-size) * 3/8)), transparent calc((var(--bg-size) * 3/8) + 1px), transparent calc((var(--bg-size) * 4/8) - 1px), var(--color-dark) calc((var(--bg-size) * 4/8)), var(--bg-b) calc((var(--bg-size) * 4/8) + 1px), var(--bg-b) calc((var(--bg-size) * 5/8) - 1px), var(--divider) calc((var(--bg-size) * 5/8)), var(--bg-b) calc((var(--bg-size) * 5/8) + 1px), var(--bg-b) calc((var(--bg-size) * 6/8) - 1px), var(--divider) calc((var(--bg-size) * 6/8)), var(--bg-b) calc((var(--bg-size) * 6/8) + 1px), var(--bg-b) calc((var(--bg-size) * 7/8) - 1px), var(--divider) calc((var(--bg-size) * 7/8)), var(--bg-b) calc((var(--bg-size) * 7/8) + 1px), var(--bg-b) calc((var(--bg-size) * 8/8) - 1px), var(--color-dark) calc((var(--bg-size) * 8/8)));background-size:calc(var(--bg-size));background-position:8rem}:host div span{width:var(--key-width);padding-right:0.5rem;border-right:0.1rem solid var(--color-line);text-align:right;user-select:none;font-size:1.2rem;border-top:0.1rem solid var(--color-bg)}:host div.black span{background:var(--color-bg);color:var(--color-white)}:host div.white{position:relative}:host div.white:before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:var(--bg-b)}:host div.white span{background:var(--color-white);color:var(--color-bg)}
`;
