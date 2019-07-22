import './components';
import { SElement } from './types';

(async() => {
  const canvas = document.querySelector(SElement.canvas)!;

  document.addEventListener('dblclick', (e) => {
    let { x, y } = canvas.getBoundingClientRect() as DOMRect;
    x = Math.abs(x) + e.clientX;
    y = Math.abs(y) + e.clientY;

    const oscillator = document.createElement(SElement.oscillator);
    oscillator.x = x;
    oscillator.y = y;
    canvas.appendChild(oscillator);
  })
})()
