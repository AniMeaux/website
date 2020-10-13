import Head from "next/head";
import * as React from "react";

function PageHead() {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
    </Head>
  );
}

type PageLayoutProps = {
  children?: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageHead />
      {children}
    </>
  );
}
