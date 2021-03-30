import Generator from '../Generator';

export default class InvalidGeneratorError extends Error {
  constructor(generatorName: string) {
    const validGenerators = Object.keys(Generator).map(g => `- "${Generator[g]}"`).join('\n');
    const errorMessage = `The required generator "${generatorName}" does not exist, please use one of the following:\n\n${validGenerators}`;
    super(errorMessage);
    this.name = "InvalidGeneratorError";
  }
}
