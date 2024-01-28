import { RemixBrowser } from "@remix-run/react";
import "focus-visible";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

if (process.env.NODE_ENV === "development") {
  import("#mocks/mocks.client.ts").then((module) => module.startWorker());
}

// Remove hydration warnings on unused class and attribute.
// These are automatically added by focus-visible.
// See https://github.com/WICG/focus-visible/blob/v5.2.0/src/focus-visible.js#L265-L274
document.documentElement.classList.remove("js-focus-visible");
document.documentElement.removeAttribute("data-js-focus-visible");

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
