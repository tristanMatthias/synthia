export const activeElement = (ele: any = document.activeElement) => {
  let e = ele;
  let next;
  while(e) {
    if (e.activeElement) next = e.activeElement
    else next = e.shadowRoot ? e.shadowRoot.activeElement : null;
    if (!next) return e;
    else e = next;
  }
  return e;
}
