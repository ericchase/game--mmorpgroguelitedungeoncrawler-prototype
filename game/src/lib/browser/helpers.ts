export function swapInnerSpanInput(div: HTMLDivElement, span: HTMLSpanElement, input: HTMLInputElement | HTMLTextAreaElement) {
  if (input.getAttribute('hidden') !== null) {
    resizeSpanInput(div, input);
    input.value = span.textContent ?? '';
    input.removeAttribute('hidden');
    input.focus();
    input.setSelectionRange(0, input.value.length);
  } else {
    span.textContent = input.value;
    input.toggleAttribute('hidden', true);
  }
}
export function resizeSpanInput(div: HTMLDivElement, el: HTMLElement) {
  const rect = div.getBoundingClientRect();
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
}

// Clipboard

export async function setClipboard(data: string): Promise<boolean> {
  if (window?.navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      return true;
    } catch (ignore) {}
  }
  return false;
}
export async function getClipboard(): Promise<string> {
  if (window?.navigator?.clipboard) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (ignore) {}
  }
  return '';
}

// Disable

export function enable(el: HTMLElement) {
  el.toggleAttribute('disabled', false);
}
export function disable(el: HTMLElement) {
  el.toggleAttribute('disabled', true);
}
