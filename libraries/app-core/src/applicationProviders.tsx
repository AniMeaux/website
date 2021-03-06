import { Button, SnackbarContainer } from "@animeaux/ui-library";
import * as Sentry from "@sentry/react";
import { AppProps } from "next/app";
import * as React from "react";
import { CloudinaryContextProvider } from "./cloudinary";
import { ErrorPage } from "./errorPage";
import { FirebaseConfig, initializeFirebase } from "./firebase";
import { PageComponent } from "./page";
import { initializeGraphQlClient, RequestContextProvider } from "./request";
import { initializeSentry, SentryConfig } from "./sentry";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "./user";

type ApplicationConfigs = {
  environment: "production" | "development" | "test";
  name: string;
  version: string;
  buildId: string;
  firebase: FirebaseConfig;
  graphQLClient: { apiUrl: string };
  sentry: Omit<
    SentryConfig,
    "environment" | "applicationName" | "applicationVersion"
  >;
};

export function initializeApplication({
  environment,
  name,
  version,
  buildId,
  firebase,
  graphQLClient,
  sentry,
}: ApplicationConfigs) {
  initializeFirebase(firebase);
  initializeGraphQlClient(graphQLClient.apiUrl);
  initializeSentry({
    ...sentry,
    environment,
    applicationName: name,
    applicationVersion: `${version}-${buildId}`,
  });
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
    <Sentry.ErrorBoundary
      fallback={({ error }) => (
        <ErrorPage
          error={error}
          action={
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Rafraîchir
            </Button>
          }
        />
      )}
    >
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
    </Sentry.ErrorBoundary>
  );
}
