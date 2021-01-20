import "react-app-polyfill/stable";
import "focus-visible";
import "@animeaux/ui-library/styles.css";

import {
  CurrentUserContextProvider,
  RequestContextProvider,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import {
  ApplicationLayout,
  ScreenSizeContextProvider,
} from "@animeaux/ui-library";
import { AppProps as BaseAppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import Logo from "../core/appLogo.svg";
import { initFirebase } from "../core/initFirebase";
import { PageComponent } from "../core/pageComponent";

initFirebase();

export function PageHead() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="application-name" content="Admin Ani'Meaux" />
      <meta name="apple-mobile-web-app-title" content="Admin Ani'Meaux" />
      <meta name="description" content="Admin app for Ani'Meaux" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#2d89ef" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0078bf" />

      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  );
}

type AppProps = Omit<BaseAppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: AppProps) {
  let children = <Component {...pageProps} />;

  return (
    <>
      <PageHead />

      <RequestContextProvider>
        <ScreenSizeContextProvider>
          <ApplicationLayout>
            <CurrentUserContextProvider
              logo={Logo}
              authorisedGroups={[UserGroup.ADMIN]}
            >
              {children}
            </CurrentUserContextProvider>
          </ApplicationLayout>
        </ScreenSizeContextProvider>
      </RequestContextProvider>
    </>
  );
}
