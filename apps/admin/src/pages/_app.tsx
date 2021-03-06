import "react-app-polyfill/stable";
import "focus-visible";
import "@animeaux/ui-library/styles.css";

import {
  ApplicationProps,
  ApplicationProviders,
  initializeApplication,
  PageHead,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import * as React from "react";
import Logo from "../core/appLogo.svg";

initializeApplication({
  environment: process.env.NODE_ENV,
  name: process.env.NEXT_PUBLIC_APP_NAME,
  version: process.env.NEXT_PUBLIC_APP_VERSION,
  buildId: process.env.NEXT_PUBLIC_APP_BUILD_ID,
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
  graphQLClient: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});

const AUTHORISED_GROUPS = [UserGroup.ADMIN];

export default function App(props: ApplicationProps) {
  return (
    <>
      <PageHead
        applicationName={process.env.NEXT_PUBLIC_APP_NAME}
        applicationDescription={process.env.NEXT_PUBLIC_APP_DESCRIPTION}
        msApplicationTileColor="#2d89ef"
        themeColor="#ffffff"
      />

      <ApplicationProviders
        logo={Logo}
        applicationName={process.env.NEXT_PUBLIC_APP_SHORT_NAME}
        authorisedGroupsForApplication={AUTHORISED_GROUPS}
        applicationProps={props}
        cloudinaryApiKey={process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}
        cloudinaryCloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
      />
    </>
  );
}
