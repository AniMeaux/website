import Head from "next/head";
import * as React from "react";

export type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  const pageTitle = title ?? process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
