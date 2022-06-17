// organize-imports-ignore
import "react-app-polyfill/stable";
import { Article, Partner } from "@animeaux/shared";
import "focus-visible";
import { Settings } from "luxon";
import NextApp, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { ReactNode } from "react";
import "wicg-inert";
import { getConfig } from "~/core/config";
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

if (typeof document !== "undefined" && process.env.NODE_ENV === "development") {
  const { startWorker } = require("../mocks");
  startWorker();
}

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
    <>
      <GoogleTagManagerScript />
      <GoogleTagManagerIframe />

      <ScreenSizeContextProvider>
        <PageHead />

        <ErrorBoundary
          fallback={() => renderWithLayout(ErrorPage, { type: "serverError" })}
        >
          <ApplicationLayout
            latestArticles={latestArticles}
            partners={partners}
          >
            {renderWithLayout(Component, pageProps)}
          </ApplicationLayout>
        </ErrorBoundary>
      </ScreenSizeContextProvider>
    </>
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

function GoogleTagManagerScript() {
  if (getConfig().googleTagManagerId == null) {
    return null;
  }

  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${getConfig().googleTagManagerId}');`,
        }}
      />
    </Head>
  );
}

function GoogleTagManagerIframe() {
  if (getConfig().googleTagManagerId == null) {
    return null;
  }

  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${
          getConfig().googleTagManagerId
        }`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      ></iframe>
    </noscript>
  );
}
