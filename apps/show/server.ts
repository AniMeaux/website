/**
 * Copied from @remix-run/server.
 *
 * We can't use `installGlobals()` with @mjackson/form-data-parser which is
 * automatically called by `@remix-run/server`.
 *
 * This is version is the same as we used, with only the following changes:
 * - Calls to `installGlobals()` have be removed.
 * - Code for `NODE_ENV="development"` have been removed. We use
 *   `remix vite:dev` in dev.
 *
 * @see https://github.com/remix-run/remix/blob/%40remix-run/serve%402.9.2/packages/remix-serve/cli.ts
 */

import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import compression from "compression";
import express from "express";
import getPort from "get-port";
import morgan from "morgan";
import { existsSync, readFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";
import { install as installSourceMapSupport } from "source-map-support";

if (process.env.NODE_ENV !== "production") {
  throw new Error("server.ts should only be run in NODE_ENV=production.");
}

installSourceMapSupport({
  retrieveSourceMap: function (source) {
    let match = source.startsWith("file://");
    if (match) {
      let filePath = fileURLToPath(source);
      let sourceMapPath = `${filePath}.map`;
      if (existsSync(sourceMapPath)) {
        return {
          url: source,
          map: readFileSync(sourceMapPath, "utf8"),
        };
      }
    }
    return null;
  },
});

run();

function parseNumber(raw?: string) {
  if (raw === undefined) return undefined;
  let maybe = Number(raw);
  if (Number.isNaN(maybe)) return undefined;
  return maybe;
}

async function run() {
  let port = parseNumber(process.env.PORT) ?? (await getPort({ port: 3000 }));

  let buildPathArg = process.argv[2];

  if (!buildPathArg) {
    console.error(`
  Usage: remix-serve <server-build-path> - e.g. remix-serve build/index.js`);
    process.exit(1);
  }

  let build = (await import(buildPathArg)) as ServerBuild;

  let onListen = () => {
    let address =
      process.env.HOST ||
      Object.values(networkInterfaces())
        .flat()
        .find((ip) => String(ip?.family).includes("4") && !ip?.internal)
        ?.address;

    if (!address) {
      console.log(`[remix-serve] http://localhost:${port}`);
    } else {
      console.log(
        `[remix-serve] http://localhost:${port} (http://${address}:${port})`,
      );
    }
  };

  let app = express();
  app.disable("x-powered-by");
  app.use(compression());
  app.use(
    build.publicPath,
    express.static(build.assetsBuildDirectory, {
      immutable: true,
      maxAge: "1y",
    }),
  );
  app.use(express.static("public", { maxAge: "1h" }));
  app.use(morgan("tiny"));

  app.all(
    "*",
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    }),
  );

  let server = process.env.HOST
    ? app.listen(port, process.env.HOST, onListen)
    : app.listen(port, onListen);

  ["SIGTERM", "SIGINT"].forEach((signal) => {
    process.once(signal, () => server?.close(console.error));
  });
}
