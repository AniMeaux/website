import { SnackbarContainer } from "@animeaux/ui-library";
import { AppProps } from "next/app";
import * as React from "react";
import { CloudinaryContextProvider } from "./cloudinary";
import { FirebaseConfig, initializeFirebase } from "./firebase";
import { PageComponent } from "./page";
import { initializeGraphQlClient, RequestContextProvider } from "./request";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "./user";

type ApplicationConfigs = {
  firebase: FirebaseConfig;
  graphQLClient: { apiUrl: string };
};

export function initializeApplication({
  firebase,
  graphQLClient,
}: ApplicationConfigs) {
  initializeFirebase(firebase);
  initializeGraphQlClient(graphQLClient.apiUrl);
}

export type ApplicationProps = Omit<AppProps, "Component"> & {
  Component: PageComponent;
};

export type ApplicationProvidersProps = Omit<
  CurrentUserContextProviderProps,
  "children" | "authorisedGroupsForPage"
> & {
  applicationProps: ApplicationProps;
  cloudinaryApiKey: string;
  cloudinaryCloudName: string;
};

export function ApplicationProviders({
  applicationProps: { Component, pageProps },
  cloudinaryApiKey,
  cloudinaryCloudName,
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
          <CloudinaryContextProvider
            apiKey={cloudinaryApiKey}
            cloudName={cloudinaryCloudName}
          >
            {children}
          </CloudinaryContextProvider>
        </CurrentUserContextProvider>
      </RequestContextProvider>

      <SnackbarContainer />
    </>
  );
}
