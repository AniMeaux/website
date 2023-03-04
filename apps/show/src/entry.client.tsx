import { RemixBrowser } from "@remix-run/react";
import "focus-visible";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

if (process.env.NODE_ENV === "development") {
  const { startWorker } = require("~/mocks");
  startWorker();
}

// Remove hydration warnings on unused class and attribute.
// These are automatically added by focus-visible.
// See https://github.com/WICG/focus-visible/blob/v5.2.0/src/focus-visible.js#L265-L274
document.documentElement.classList.remove("js-focus-visible");
document.documentElement.removeAttribute("data-js-focus-visible");

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if (window.requestIdleCallback != null) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support `requestIdleCallback`.
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
