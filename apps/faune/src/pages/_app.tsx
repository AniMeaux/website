import "react-app-polyfill/stable";
import "focus-visible";
import "@animeaux/ui-library/styles.css";

import {
  ApplicationProps,
  ApplicationProviders,
  initializeCloudinary,
  initializeGraphQlClient,
  PageHead,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import * as React from "react";
import Logo from "../core/appLogo.svg";
import { initFirebase } from "../core/firebase";

initFirebase();
initializeGraphQlClient(process.env.NEXT_PUBLIC_API_URL);
initializeCloudinary({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
});

const AUTHORISED_GROUPS = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default function App(props: ApplicationProps) {
  return (
    <>
      <PageHead
        applicationName={process.env.NEXT_PUBLIC_APP_NAME}
        applicationDescription={process.env.NEXT_PUBLIC_APP_DESCRIPTION}
        msApplicationTileColor="#b91d47"
        themeColor="#ffffff"
      />

      <ApplicationProviders
        logo={Logo}
        applicationName={process.env.NEXT_PUBLIC_APP_SHORT_NAME}
        authorisedGroupsForApplication={AUTHORISED_GROUPS}
        applicationProps={props}
      />
    </>
  );
}
