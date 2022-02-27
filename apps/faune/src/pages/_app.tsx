import "react-app-polyfill/stable";
import "focus-visible";
import "styles/index.css";

import { CurrentUserContextProvider } from "account/currentUser";
import { Button } from "core/actions/button";
import { ErrorPage } from "core/layouts/errorPage";
import { PageHead } from "core/pageHead";
import { SnackbarContainer } from "core/popovers/snackbar";
import { RequestContextProvider } from "core/request";
import { ScreenSizeContextProvider } from "core/screenSize";
import { Sentry } from "core/sentry";
import { PageComponent } from "core/types";
import "core/yup";
import { Settings } from "luxon";
import NextApp, { AppContext, AppProps } from "next/app";
import { GlobalStyles, ResetStyles } from "styles/theme";

Settings.defaultLocale = "fr";

type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: ApplicationProps) {
  let children = <Component {...pageProps} />;
  if (Component.renderLayout != null) {
    children = Component.renderLayout({ ...pageProps, children });
  }

  return (
    <>
      <PageHead />
      <ResetStyles />
      <GlobalStyles />

      <Sentry.ErrorBoundary
        fallback={() => (
          <ErrorPage
            status={500}
            action={
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Rafraîchir
              </Button>
            }
          />
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

// Just to make sure runtime config can be used (incompatible with Automatic
// Static Optimization).
// https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
App.getInitialProps = async (appContext: AppContext) => {
  return await NextApp.getInitialProps(appContext);
};
