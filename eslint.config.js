import defaultConfig from "@animeaux/dev-tools/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Workspace packages have their own ESLint config.
  globalIgnores(["./apps", "./libs", "./scripts"]),

  { extends: [defaultConfig] },
]);
