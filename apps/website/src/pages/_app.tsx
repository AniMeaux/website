import "react-app-polyfill/stable";
import "focus-visible";
import "wicg-inert";
import "~/styles/index.css";

import * as Sentry from "@sentry/react";
import { AppProps } from "next/app";
import * as React from "react";
import { initializeGraphQlClient } from "~/core/fetchGraphQL";
import { PageComponent } from "~/core/pageComponent";
import { PageHead } from "~/core/pageHead";
import { ScreenSizeContextProvider } from "~/core/screenSize";
import { initializeSentry } from "~/core/sentry";
import ErrorPage from "./_error";

initializeGraphQlClient();
initializeSentry();

export type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: ApplicationProps) {
  let children: React.ReactNode = <Component {...pageProps} />;
  if (Component.renderLayout != null) {
    children = Component.renderLayout(children, pageProps);
  }

  return (
    <Sentry.ErrorBoundary fallback={() => <ErrorPage type="serverError" />}>
      <ScreenSizeContextProvider>
        <PageHead />
        {children}
      </ScreenSizeContextProvider>
    </Sentry.ErrorBoundary>
  );
}
