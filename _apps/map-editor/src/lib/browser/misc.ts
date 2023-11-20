export function enable(el: HTMLElement) {
  el.toggleAttribute('disabled', false);
}
export function disable(el: HTMLElement) {
  el.toggleAttribute('disabled', true);
}
