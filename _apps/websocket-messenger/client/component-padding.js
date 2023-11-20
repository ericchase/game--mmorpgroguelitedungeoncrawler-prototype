const html = `
<link rel="stylesheet" href="./component-padding.css" />
<div class="row">
  <div class="space"></div>
  <div class="col">
    <div class="space"></div>
    <slot>Empty.</slot>
    <div class="space"></div>
  </div>
  <div class="space"></div>
</div>
`;

class ComponentPadding extends HTMLElement {
  static observedAttributes = ['fill-h', 'fill-w'];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = html;
    this.col = shadowRoot.querySelector('.col');
    this.row = shadowRoot.querySelector('.row');
  }

  /**
   * @param {string} name
   * @param {string|undefined|null} oldValue
   * @param {string|undefined|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    newValue ??= null;
    switch (name) {
      case 'fill-h': {
        newValue !== null //
          ? this.row?.classList.add(name)
          : this.row?.classList.remove(name);
        break;
      }
      case 'fill-w': {
        newValue !== null //
          ? this.col?.classList.add(name)
          : this.col?.classList.remove(name);
        break;
      }
    }
  }
}

customElements.define('wc-padding', ComponentPadding);
