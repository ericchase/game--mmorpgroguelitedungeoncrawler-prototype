/**
 * @class ComponentAutosizeInput
 * @extends {HTMLElement}
 */
class ComponentAutosizeInput extends HTMLElement {
  static template = `
<link rel="stylesheet" href="./component-autosize-input.css" />
<div class="relative">
  <div id="box" tabindex="0"><span id="content"></span><span id="mold">.</span></div>
  <textarea id="edit" class="absolute" hidden></textarea>
</div>
`;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = ComponentAutosizeInput.template;
    this.box = /** @type {HTMLDivElement} */ (shadowRoot.querySelector('#box'));
    this.content = /** @type {HTMLSpanElement} */ (shadowRoot.querySelector('#content'));
    this.edit = /** @type {HTMLTextAreaElement} */ (shadowRoot.querySelector('#edit'));
    this.setup();
  }

  /** @this {ComponentAutosizeInput} */
  setup() {
    const box = this.box;
    const content = this.content;
    const edit = this.edit;
    const resize = this.resize.bind(this);

    function init() {
      box.removeEventListener('click', init);
      box.removeEventListener('focus', init);
      box.removeAttribute('tabindex');
      edit.addEventListener('input', () => {
        content.textContent = edit.value;
        resize();
        console.log(edit.value);
        edit.dispatchEvent(new CustomEvent('change', { composed: true, bubbles: true }));
      });
      edit.removeAttribute('hidden');
      edit.focus();
      resize();
    }
    box.addEventListener('click', init);
    box.addEventListener('focus', init);
  }

  /** @this {ComponentAutosizeInput} */
  resize() {
    const { height, width } = this.box.getBoundingClientRect();
    this.edit.style.height = height + 'px';
    this.edit.style.width = width + 'px';
  }

  /** @this {ComponentAutosizeInput} */
  getText() {
    return this.edit.value;
  }
  setText(text) {
    this.content.textContent = text;
    this.edit.value = text;
  }

  /**
   * @param {string} name
   * @param {string|undefined|null} oldValue
   * @param {string|undefined|null} newValue
   */
  // attributeChangedCallback(name, oldValue, newValue) {
  //   newValue ??= null;
  //   switch (name) {
  //     case 'fill-h': {
  //       newValue !== null //
  //         ? this.row?.classList.add(name)
  //         : this.row?.classList.remove(name);
  //       break;
  //     }
  //     case 'fill-w': {
  //       newValue !== null //
  //         ? this.col?.classList.add(name)
  //         : this.col?.classList.remove(name);
  //       break;
  //     }
  //   }
  // }
}

customElements.define('component-autosize-input', ComponentAutosizeInput);
