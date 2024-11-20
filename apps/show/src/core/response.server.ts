export function notFound(init?: ResponseInit) {
  return new Response("Not Found", { status: 404, ...init });
}
