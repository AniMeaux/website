export class NotFoundResponse extends Response {
  constructor() {
    super("Not Found", { status: 404 });
  }
}
