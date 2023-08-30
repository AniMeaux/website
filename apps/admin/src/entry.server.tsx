import { extendCurrentUserPreferences } from "#currentUser/preferences.server.ts";
import { extendCurrentUserSession } from "#currentUser/session.server.ts";
import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { PassThrough } from "node:stream";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

if (process.env.NODE_ENV === "development") {
  const { startWorker } = require("#mocks/mocks.server.ts");
  startWorker();
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // We don't want it to be index by search engines.
  // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
  responseHeaders.set("X-Robots-Tag", "noindex");

  await extendCurrentUserSession(request.headers, responseHeaders);
  await extendCurrentUserPreferences(request.headers, responseHeaders);

  const callbackName: keyof Pick<
    RenderToPipeableStreamOptions,
    "onAllReady" | "onShellReady"
  > = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [callbackName]() {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },

        onShellError(error) {
          reject(error);
        },

        onError(error) {
          didError = true;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request },
) => {
  await extendCurrentUserSession(request.headers, response.headers);
  await extendCurrentUserPreferences(request.headers, response.headers);
  return response;
};
