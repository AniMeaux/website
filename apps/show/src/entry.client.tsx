import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

import { initMonitoring } from "#i/core/monitoring.client"

initMonitoring()

if (process.env.NODE_ENV === "development") {
  void import("#i/mocks/mocks.client").then((module) => module.startWorker())
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  )
})
