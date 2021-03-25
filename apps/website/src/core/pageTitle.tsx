import Head from "next/head";
import * as React from "react";

type PageTitleProps = {
  title?: string;
};

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>
        {[title, process.env.NEXT_PUBLIC_APP_NAME]
          .filter(isDefined)
          .join(" • ")}
      </title>
    </Head>
  );
}
