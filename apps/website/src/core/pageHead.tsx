import Head from "next/head";
import * as React from "react";

export function PageHead() {
  return (
    <Head>
      <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      <meta charSet="utf-8" />

      <meta
        name="application-name"
        content={process.env.NEXT_PUBLIC_APP_NAME}
      />

      <meta
        name="description"
        content={process.env.NEXT_PUBLIC_APP_DESCRIPTION}
      />

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
    </Head>
  );
}
