import { EntryContext, Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";

const ABORT_DELAY = 5000;

if (process.env.NODE_ENV === "development") {
  const { startWorker } = require("~/mocks/mocks.server");
  startWorker();
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          // We don't want it to be index by search engines.
          // See https://developers.google.com/search/docs/advanced/crawling/block-indexing
          responseHeaders.set("X-Robots-Tag", "noindex");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },

        onShellError: (error: unknown) => {
          reject(error);
        },

        onError: (error: unknown) => {
          didError = true;
          console.error("renderToPipeableStream:", error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
