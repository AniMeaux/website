import "dotenv-flow/config"

import { defineConfig, env } from "prisma/config"

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },

  migrations: {
    path: "./migrations",
    seed: "tsx -r dotenv-flow/config ./scripts/seed-data.ts",
  },
})
