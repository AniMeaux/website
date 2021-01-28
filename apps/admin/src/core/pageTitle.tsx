import { PageTitle as BasePageTitle, PageTitleProps } from "@animeaux/app-core";
import * as React from "react";

export function PageTitle(props: Omit<PageTitleProps, "applicationName">) {
  return (
    <BasePageTitle
      {...props}
      applicationName={process.env.NEXT_PUBLIC_APP_NAME}
    />
  );
}
