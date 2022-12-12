export class NotFoundResponse extends Response {
  constructor() {
    super("Not found", { status: 404 });
  }
}

export class ForbiddenResponse extends Response {
  constructor() {
    super("Forbidden", { status: 403 });
  }
}
