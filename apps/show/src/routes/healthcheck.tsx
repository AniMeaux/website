// learn more: https://fly.io/docs/reference/configuration/#services-http_checks

export async function loader() {
  // We're good if we get called.
  return new Response("OK");
}
