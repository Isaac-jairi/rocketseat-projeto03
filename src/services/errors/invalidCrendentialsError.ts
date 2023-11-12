export class InvalidCrendentialsError extends Error {
  constructor() {
    super('Email or Password incorrect')
  }
}
