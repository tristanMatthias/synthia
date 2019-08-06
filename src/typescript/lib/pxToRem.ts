export const pxToRem = (number: number) => {
  const base = 10 / parseFloat(getComputedStyle(document.documentElement).fontSize || '10px');
  return number * base / 10;
}
// @ts-ignore
window.pxToRem = pxToRem;
export const remToPx = (number: number) => {
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize || '10px') / 10;
  return number * base * 10;
}
// @ts-ignore
window.remToPx = remToPx;
