import Head from "next/head";
import * as React from "react";

type PageTitleProps = {
  title?: string;
};

export function PageTitle({ title }: PageTitleProps) {
  let pageTitle = process.env.NEXT_PUBLIC_APP_NAME;

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
