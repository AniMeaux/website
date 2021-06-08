import * as Sentry from "@sentry/react";
import { CloudinaryContextProvider } from "core/cloudinary";
import { FirebaseConfig, initializeFirebase } from "core/firebase";
import { initializeGraphQlClient, RequestContextProvider } from "core/request";
import { ScreenSizeContextProvider } from "core/screenSize";
import { initializeSentry, SentryConfig } from "core/sentry";
import { PageComponent } from "core/types";
import { ErrorActionRefresh, ErrorMessage } from "dataDisplay/errorMessage";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "entities/user/currentUserContext";
import { AppProps } from "next/app";
import { SnackbarContainer } from "popovers/snackbar";
import * as React from "react";

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
      fallback={() => (
        <ErrorMessage type="serverError" action={<ErrorActionRefresh />} />
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
