import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { createRequire } from "node:module";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Install the web fetch globals for Node.
installGlobals();

export default defineConfig({
  cacheDir: "./node_modules/.cache/vite",
  server: { port: 3000, strictPort: true },
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
  ],
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
