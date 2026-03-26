export class Gallery {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }

  render(): HTMLElement {
    return this.catalogElement;
  }
}