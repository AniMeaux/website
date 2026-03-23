import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { config } from "dotenv-flow"

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../") })
