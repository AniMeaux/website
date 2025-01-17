export function ok(init?: ResponseInit) {
  return new Response("OK", { status: 200, ...init });
}

export function notFound(init?: ResponseInit) {
  return new Response("Not Found", { status: 404, ...init });
}

export function badRequest(init?: ResponseInit) {
  return new Response("Bad Request", { status: 400, ...init });
}

export function forbidden(init?: ResponseInit) {
  return new Response("Forbidden", { status: 403, ...init });
}
