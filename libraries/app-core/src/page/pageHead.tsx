import Head from "next/head";
import * as React from "react";

type PageHeadProps = {
  applicationName: string;
  applicationDescription: string;
  themeColor: string;
  msApplicationTileColor: string;
};

export function PageHead({
  applicationName,
  applicationDescription,
  themeColor,
  msApplicationTileColor,
}: PageHeadProps) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="application-name" content={applicationName} />
      <meta name="description" content={applicationDescription} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={themeColor} />

      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
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
        sizes="96x96"
        href="/favicon-96x96.png"
      />

      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      {/* Windows specificities. */}
      <meta name="msapplication-TileColor" content={msApplicationTileColor} />

      {/*
        iOS specificities.
        https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
      */}

      <meta name="apple-mobile-web-app-title" content={applicationName} />

      {/* 
        Sets whether a web application runs in full-screen mode.
        https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW3
      */}
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/*
        Sets the style of the status bar for a web application.
        https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW4
      */}
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/*
        Enables or disables automatic detection of possible phone numbers in a
        webpage in Safari on iOS.
        https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW5
      */}
      <meta name="format-detection" content="telephone=no" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon-180x180.png"
      />
    </Head>
  );
}
