// organize-imports-ignore
import "react-app-polyfill/stable";
import { Article, Partner } from "@animeaux/shared";
import "focus-visible";
import { Settings } from "luxon";
import NextApp, { AppContext, AppProps } from "next/app";
import { ReactNode } from "react";
import "wicg-inert";
import { PageComponent } from "~/core/pageComponent";
import { PageHead } from "~/core/pageHead";
import { ScreenSizeContextProvider } from "~/core/screenSize";
import { ErrorBoundary } from "~/core/sentry";
import { articles } from "~/elements/blog/data";
import { partners } from "~/elements/partners/data";
import { ApplicationLayout } from "~/layout/applicationLayout";
import { ErrorPage } from "~/pages/_error";
import "~/styles/index.css";

Settings.defaultLocale = "fr";

function renderWithLayout<P = {}, IP = P>(
  Component: PageComponent<P, IP>,
  props: P
) {
  let children: ReactNode = <Component {...props} />;

  if (Component.renderLayout != null) {
    children = Component.renderLayout(children, props);
  }

  return <>{children}</>;
}

type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
  latestArticles: Article[];
  partners: Partner[];
};

function App({
  Component,
  pageProps,
  latestArticles,
  partners,
}: ApplicationProps) {
  return (
    <ScreenSizeContextProvider>
      <PageHead />

      <ErrorBoundary
        fallback={() => renderWithLayout(ErrorPage, { type: "serverError" })}
      >
        <ApplicationLayout latestArticles={latestArticles} partners={partners}>
          {renderWithLayout(Component, pageProps)}
        </ApplicationLayout>
      </ErrorBoundary>
    </ScreenSizeContextProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    latestArticles: articles,
    partners: partners.slice(0, 5),
  };
};

export default App;
