import "react-app-polyfill/stable";
import "focus-visible";
import "styles/index.css";

import { UserGroup } from "@animeaux/shared-entities";
import {
  ApplicationProps,
  ApplicationProviders,
  initializeApplication,
} from "core/applicationProviders";
import { PageHead } from "core/pageHead";
import * as React from "react";

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

const AUTHORISED_GROUPS = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default function App(props: ApplicationProps) {
  return (
    <>
      <PageHead />

      <ApplicationProviders
        authorisedGroupsForApplication={AUTHORISED_GROUPS}
        applicationProps={props}
        cloudinaryApiKey={process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}
        cloudinaryCloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
      />
    </>
  );
}
