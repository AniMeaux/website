import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "./node_modules/.cache/vite",
  server: { port: 3001, strictPort: true },
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
  ],
});
