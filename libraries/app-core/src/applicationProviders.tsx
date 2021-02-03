import { SnackbarContainer } from "@animeaux/ui-library";
import { AppProps } from "next/app";
import * as React from "react";
import { PageComponent } from "./page";
import { RequestContextProvider } from "./request";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "./user";

export type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
};

export type ApplicationProvidersProps = Omit<
  CurrentUserContextProviderProps,
  "children" | "authorisedGroupsForPage"
> & {
  applicationProps: ApplicationProps;
};

export function ApplicationProviders({
  applicationProps: { Component, pageProps },
  ...props
}: ApplicationProvidersProps) {
  let children = <Component {...pageProps} />;

  if (Component.WrapperComponent != null) {
    children = (
      <Component.WrapperComponent>{children}</Component.WrapperComponent>
    );
  }

  return (
    <>
      <RequestContextProvider>
        <CurrentUserContextProvider
          {...props}
          authorisedGroupsForPage={Component.authorisedGroups}
        >
          {children}
        </CurrentUserContextProvider>
      </RequestContextProvider>

      <SnackbarContainer />
    </>
  );
}
