export class HTTPError extends Error {
  statusCode: number;
  message: string;
  context?: string;

  constructor(statusCode: number, message: string, context?: Object) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.context = context?.constructor.name;
  }
}
