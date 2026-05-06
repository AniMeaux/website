import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  cacheDir: "./node_modules/.cache/vite",

  plugins: [tailwindcss(), tsconfigPaths()],
})
