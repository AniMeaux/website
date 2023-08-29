import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import invariant from "tiny-invariant";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );

  responseHeaders.set("Content-Type", "text/html");

  if (process.env.NODE_ENV === "production") {
    invariant(process.env.RUNTIME_ENV, "RUNTIME_ENV should be defined");

    if (process.env.RUNTIME_ENV === "staging") {
      // We don't want it to be index by search engines.
      // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
      responseHeaders.set("X-Robots-Tag", "noindex");
    }
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
