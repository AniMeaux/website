import { initMonitoring } from "#core/monitoring.client";
import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

initMonitoring();

if (process.env.NODE_ENV === "development") {
  import("#mocks/mocks.client").then((module) => module.startWorker());
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
