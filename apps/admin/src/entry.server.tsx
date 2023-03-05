import { EntryContext, Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";
import { prisma } from "~/core/db.server";

const ABORT_DELAY = 5000;

if (process.env.NODE_ENV === "development") {
  const { startWorker } = require("~/mocks/mocks.server");
  startWorker();
}

if (process.env.SENTRY_DSN != null) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1,
    integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  });
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
