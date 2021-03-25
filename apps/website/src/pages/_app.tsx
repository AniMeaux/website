import "normalize.css/normalize.css";
import "focus-visible";
import "../core/styles.css";

import * as Sentry from "@sentry/react";
import { AppProps } from "next/app";
import Error from "next/error";
import * as React from "react";
import { PageHead } from "../core/pageHead";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => <Error statusCode={500} title={error.message} />}
    >
      <PageHead />
      <Component {...pageProps} />
    </Sentry.ErrorBoundary>
  );
}
