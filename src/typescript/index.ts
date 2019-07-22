import './components';
import { SElement } from './types';

(async() => {
  const canvas = document.querySelector(SElement.canvas)!;

  document.addEventListener('dblclick', (e) => {
    let { x, y } = canvas.getBoundingClientRect() as DOMRect;
    x = Math.abs(x) + e.clientX;
    y = Math.abs(y) + e.clientY;

    let object;
    if (e.shiftKey) object = document.createElement(SElement.filter);
    else object = document.createElement(SElement.oscillator);

    object.x = x;
    object.y = y;
    canvas.appendChild(object);
  })
})()
