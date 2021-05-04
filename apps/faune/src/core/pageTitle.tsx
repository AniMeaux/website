import Head from "next/head";
import * as React from "react";

export type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>{title ?? process.env.NEXT_PUBLIC_APP_NAME}</title>
    </Head>
  );
}
