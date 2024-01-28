import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { PassThrough } from "node:stream";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import invariant from "tiny-invariant";

const ABORT_DELAY = 5000;

if (process.env.NODE_ENV === "development") {
  import("#mocks/mocks.server.ts").then((module) => module.startWorker());
}

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
        abortDelay={ABORT_DELAY}
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

    setTimeout(abort, ABORT_DELAY);
  });
}
