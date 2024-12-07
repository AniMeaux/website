export class OkResponse extends Response {
  constructor() {
    super("OK", { status: 200 });
  }
}

export class NotFoundResponse extends Response {
  constructor() {
    super("Not Found", { status: 404 });
  }
}

export class BadRequestResponse extends Response {
  constructor() {
    super("Bad Request", { status: 400 });
  }
}

export class ForbiddenResponse extends Response {
  constructor() {
    super("Forbidden", { status: 403 });
  }
}
