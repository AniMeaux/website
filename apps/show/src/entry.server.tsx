import { checkEnv, getClientEnv } from "#i/core/env.server";
import { initMonitoring } from "#i/core/monitoring.server";
import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { sentryHandleError } from "@sentry/remix";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import invariant from "tiny-invariant";

checkEnv();
global.CLIENT_ENV = getClientEnv();
initMonitoring();

const ABORT_DELAY_MS = 60_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  if (process.env.NODE_ENV === "production") {
    invariant(process.env.RUNTIME_ENV, "RUNTIME_ENV should be defined");

    if (process.env.RUNTIME_ENV === "staging") {
      // We don't want it to be index by search engines.
      // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
      responseHeaders.set("X-Robots-Tag", "noindex");
    }
  }

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

export const handleError = sentryHandleError;
