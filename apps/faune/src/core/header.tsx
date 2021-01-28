import { Header as BaseHeader, HeaderProps } from "@animeaux/app-core";
import * as React from "react";
import Logo from "./appLogo.svg";

export function Header(
  props: Omit<HeaderProps, "applicationLogo" | "applicationName">
) {
  return (
    <BaseHeader
      {...props}
      applicationLogo={Logo}
      applicationName={process.env.NEXT_PUBLIC_APP_SHORT_NAME}
    />
  );
}
