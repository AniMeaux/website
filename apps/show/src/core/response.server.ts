export function badRequest(init?: ResponseInit) {
  return new Response("Bad Request", { status: 400, ...init });
}

export function notFound(init?: ResponseInit) {
  return new Response("Not Found", { status: 404, ...init });
}

export function unauthorized(init?: ResponseInit) {
  return new Response("Unauthorized", { status: 401, ...init });
}
