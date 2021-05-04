import * as Sentry from "@sentry/react";
import { CloudinaryContextProvider } from "core/cloudinary";
import { ErrorPage } from "core/errorPage";
import { FirebaseConfig, initializeFirebase } from "core/firebase";
import { PageComponent } from "core/pageComponent";
import { initializeGraphQlClient, RequestContextProvider } from "core/request";
import { initializeSentry, SentryConfig } from "core/sentry";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "entities/user/currentUserContext";
import { AppProps } from "next/app";
import * as React from "react";
import { Button } from "ui/actions/button";
import { SnackbarContainer } from "ui/popovers/snackbar";
import { ScreenSizeContextProvider } from "ui/screenSize";

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
            <Button onClick={() => window.location.reload()}>Rafraîchir</Button>
          }
        />
      )}
    >
      <ScreenSizeContextProvider>
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
      </ScreenSizeContextProvider>
    </Sentry.ErrorBoundary>
  );
}
