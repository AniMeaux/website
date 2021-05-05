import "react-app-polyfill/stable";
import "focus-visible";
import "wicg-inert";
import "~/styles/index.css";

import * as Sentry from "@sentry/react";
import { AppProps } from "next/app";
import Error from "next/error";
import * as React from "react";
import { initializeGraphQlClient } from "~/core/fetchGraphQL";
import { PageHead } from "~/core/pageHead";
import { ScreenSizeContextProvider } from "~/core/screenSize";

initializeGraphQlClient(process.env.NEXT_PUBLIC_API_URL);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => <Error statusCode={500} title={error.message} />}
    >
      <ScreenSizeContextProvider>
        <PageHead />
        <Component {...pageProps} />
      </ScreenSizeContextProvider>
    </Sentry.ErrorBoundary>
  );
}
