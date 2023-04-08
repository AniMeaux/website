import { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { extendCurrentUserSession } from "~/currentUser/session.server";

if (process.env.NODE_ENV === "development") {
  const { startWorker } = require("~/mocks/mocks.server");
  startWorker();
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  await extendCurrentUserSession(request.headers, responseHeaders);

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  // We don't want it to be index by search engines.
  // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
  responseHeaders.set("X-Robots-Tag", "noindex");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request }
) => {
  await extendCurrentUserSession(request.headers, response.headers);
  return response;
};
