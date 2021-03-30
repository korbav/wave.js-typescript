export default class CanvasNotFoundError extends Error {
  constructor(elementId: string) {
    const errorMessage = ` Could not find the canvas with id "${elementId}"`;
    super(errorMessage);
    this.name = "CanvasNotFoundError";
  }
}
