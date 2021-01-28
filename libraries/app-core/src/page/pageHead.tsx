import Head from "next/head";
import * as React from "react";

type PageHeadProps = {
  applicationName: string;
  applicationDescription: string;
  msApplicationTileColor: string;
  safariPinnedTabColor: string;
};

export function PageHead({
  applicationName,
  applicationDescription,
  msApplicationTileColor,
  safariPinnedTabColor,
}: PageHeadProps) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="application-name" content={applicationName} />
      <meta name="apple-mobile-web-app-title" content={applicationName} />
      <meta name="description" content={applicationDescription} />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content={msApplicationTileColor} />

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

      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color={safariPinnedTabColor}
      />

      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  );
}
