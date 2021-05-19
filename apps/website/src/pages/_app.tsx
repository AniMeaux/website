import "react-app-polyfill/stable";
import "focus-visible";
import "wicg-inert";
import "~/styles/index.css";

import { Article } from "@animeaux/shared-entities/build/article";
import NextApp, { AppContext, AppProps } from "next/app";
import { ReactNode } from "react";
import { PageComponent } from "~/core/pageComponent";
import { PageHead } from "~/core/pageHead";
import { ScreenSizeContextProvider } from "~/core/screenSize";
import { ErrorBoundary } from "~/core/sentry";
import { articles } from "~/elements/blog/data";
import { ApplicationLayout } from "~/layout/applicationLayout";
import { ErrorPage } from "~/pages/_error";

function renderWithLayout<P = {}, IP = P>(
  Component: PageComponent<P, IP>,
  props: P
) {
  let children: ReactNode = <Component {...props} />;

  if (Component.renderLayout != null) {
    children = Component.renderLayout(children, props);
  }

  return children;
}

type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
  latestArticles: Article[];
};

function App({ Component, pageProps, latestArticles }: ApplicationProps) {
  return (
    <ScreenSizeContextProvider>
      <PageHead />

      <ErrorBoundary
        fallback={() => renderWithLayout(ErrorPage, { type: "serverError" })}
      >
        <ApplicationLayout latestArticles={latestArticles}>
          {renderWithLayout(Component, pageProps)}
        </ApplicationLayout>
      </ErrorBoundary>
    </ScreenSizeContextProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps, latestArticles: articles };
};

export default App;
