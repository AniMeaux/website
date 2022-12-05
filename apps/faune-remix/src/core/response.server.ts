export class NotFoundResponse extends Response {
  constructor() {
    super("Not found", { status: 404 });
  }
}
