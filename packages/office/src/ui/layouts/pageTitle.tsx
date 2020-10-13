import Head from "next/head";
import * as React from "react";

type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  let pageTitle = "Office";

  if (title != null) {
    pageTitle = `${title} | ${pageTitle}`;
  }

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
