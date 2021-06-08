import "react-app-polyfill/stable";
import "focus-visible";
import "styles/index.css";

import { PageHead } from "core/pageHead";
import { RequestContextProvider } from "core/request";
import { ScreenSizeContextProvider } from "core/screenSize";
import { Sentry } from "core/sentry";
import { PageComponent } from "core/types";
import { ErrorActionRefresh, ErrorMessage } from "dataDisplay/errorMessage";
import { CurrentUserContextProvider } from "entities/user/currentUserContext";
import { AppProps } from "next/app";
import { SnackbarContainer } from "popovers/snackbar";
import * as React from "react";

type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: ApplicationProps) {
  let children = <Component {...pageProps} />;

  if (Component.WrapperComponent != null) {
    children = (
      <Component.WrapperComponent>{children}</Component.WrapperComponent>
    );
  }

  return (
    <>
      <PageHead />

      <Sentry.ErrorBoundary
        fallback={() => (
          <ErrorMessage type="serverError" action={<ErrorActionRefresh />} />
        )}
      >
        <ScreenSizeContextProvider>
          <RequestContextProvider>
            <CurrentUserContextProvider
              authorisedGroupsForPage={Component.authorisedGroups}
            >
              {children}
            </CurrentUserContextProvider>
          </RequestContextProvider>

          <SnackbarContainer />
        </ScreenSizeContextProvider>
      </Sentry.ErrorBoundary>
    </>
  );
}
