import Head from "next/head";
import * as React from "react";

export type PageTitleProps = {
  title?: string | null;
  applicationName: string;
};

export function PageTitle({ title, applicationName }: PageTitleProps) {
  return (
    <Head>
      <title>{title ?? applicationName}</title>
    </Head>
  );
}
