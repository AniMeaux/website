import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { createRequire } from "node:module";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Install the web fetch globals for Node.
installGlobals();

const shouldCreateSentryRelease = process.env.SENTRY_AUTH_TOKEN != null;

if (shouldCreateSentryRelease) {
  console.log(
    "A new Sentry release we be created:",
    `admin-${process.env.APPLICATION_VERSION}`,
  );
} else {
  console.log(
    "Not creating a new Sentry release for:",
    `admin-${process.env.APPLICATION_VERSION}`,
  );
}

export default defineConfig({
  cacheDir: "./node_modules/.cache/vite",
  server: { port: 3002, strictPort: true },
  ssr: { noExternal: /^@animeaux\// },

  plugins: [
    remix({
      appDirectory: "./src",

      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
      },
    }),

    // Leverages the `paths` option in tsconfig.json.
    tsconfigPaths(),

    prismaClient(),

    shouldCreateSentryRelease
      ? sentryVitePlugin({
          org: "animeaux",
          project: "admin",
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            // Prefix release as they're global per organization.
            // https://docs.sentry.io/platforms/javascript/guides/remix/configuration/releases/#bind-the-version
            name: `admin-${process.env.APPLICATION_VERSION}`,
            inject: true,
          },
          sourcemaps: {
            filesToDeleteAfterUpload: ["./build/**/*.map"],
          },
        })
      : null,
  ],

  build: {
    sourcemap: shouldCreateSentryRelease,
  },
});

/**
 * Fixes:
 *
 * Uncaught TypeError: Error resolving module specifier “.prisma/client/index-browser”.
 * Relative module specifiers must start with “./”, “../” or “/”.
 *
 * @see https://github.com/prisma/prisma/issues/12504#issuecomment-1285883083
 */
function prismaClient(): Plugin {
  const require = createRequire(import.meta.url);
  const path = require.resolve(".prisma/client/index-browser.js");

  return {
    name: "prisma-vite-plugin",

    config: () => ({
      resolve: {
        alias: { ".prisma/client/index-browser": path },
      },
    }),
  };
}
