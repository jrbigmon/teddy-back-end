export class DataAlreadySavedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = DataAlreadySavedException.name;
  }
}
