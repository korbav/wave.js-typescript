export default class ElementNotFoundError extends Error {
  constructor(elementId: string) {
    const errorMessage = ` Could not find the element with id "${elementId}"`;
    super(errorMessage);
    this.name = "ElementNotFoundError";
  }
}
