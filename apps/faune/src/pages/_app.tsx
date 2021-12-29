import "react-app-polyfill/stable";
import "focus-visible";
import "styles/index.css";

import { CurrentUserContextProvider } from "account/currentUser";
import { Button } from "core/actions/button";
import { ErrorMessage } from "core/dataDisplay/errorMessage";
import { PageHead } from "core/pageHead";
import { SnackbarContainer } from "core/popovers/snackbar";
import { RequestContextProvider } from "core/request";
import { ScreenSizeContextProvider } from "core/screenSize";
import { Sentry } from "core/sentry";
import { PageComponent } from "core/types";
import { AppProps } from "next/app";
import { GlobalStyles, ResetStyles } from "styles/theme";

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
      <ResetStyles />
      <GlobalStyles />

      <Sentry.ErrorBoundary
        fallback={() => (
          <main>
            <ErrorMessage
              type="serverError"
              action={
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Rafraîchir
                </Button>
              }
            />
          </main>
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
