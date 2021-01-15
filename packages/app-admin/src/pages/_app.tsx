import "react-app-polyfill/stable";
import "focus-visible";
import "../core/styles.css";

import {
  CurrentUserContextProvider,
  RequestContextProvider,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import { ScreenSizeContextProvider } from "@animeaux/ui-library";
import { AppProps as BaseAppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import { initFirebase } from "../core/initFirebase";
import { PageComponent } from "../core/pageComponent";
import Logo from "../ui/logoWithColors.svg";

initFirebase();

export function PageHead() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="application-name" content="Admin Ani'Meaux" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Admin Ani'Meaux" />
      <meta name="description" content="Admin app for Ani'Meaux" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#0078bf" />

      <link rel="apple-touch-icon" href="/icons/apple-touch-icon-iphone.png" />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/icons/apple-touch-icon-ipad.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon-iphone-retina.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/icons/apple-touch-icon-ipad-retina.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="mask-icon"
        href="/icons/safari-pinned-tab.svg"
        color="#0078bf"
      />
      <link rel="shortcut icon" href="/icons/favicon.ico" />

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
          <CurrentUserContextProvider
            logo={Logo}
            authorisedGroups={[UserGroup.ADMIN]}
          >
            {children}
          </CurrentUserContextProvider>
        </ScreenSizeContextProvider>
      </RequestContextProvider>
    </>
  );
}
