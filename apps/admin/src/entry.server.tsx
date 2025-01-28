import { checkEnv, getClientEnv } from "#core/env.server";
import { extendCurrentUserPreferences } from "#current-user/preferences.server";
import { extendCurrentUserSession } from "#current-user/session.server";
import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";

checkEnv();
global.CLIENT_ENV = getClientEnv();

const ABORT_DELAY_MS = 5000;

if (process.env.NODE_ENV === "development") {
  import("#mocks/mocks.server").then((module) => module.startWorker());
}

if (process.env.ENABLE_CRONS === "true") {
  import("#core/crons/crons.server").then((module) => module.startCrons());
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
        abortDelay={ABORT_DELAY_MS}
      />,
      {
        [callbackName]() {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(createReadableStreamFromReadable(body), {
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

    setTimeout(abort, ABORT_DELAY_MS);
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
