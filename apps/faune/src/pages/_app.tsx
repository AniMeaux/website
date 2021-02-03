import "react-app-polyfill/stable";
import "focus-visible";
import "@animeaux/ui-library/styles.css";

import {
  ApplicationProps,
  ApplicationProviders,
  initializeGraphQlClient,
  PageHead,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import * as React from "react";
import Logo from "../core/appLogo.svg";
import { initFirebase } from "../core/initFirebase";

initFirebase();
initializeGraphQlClient(process.env.NEXT_PUBLIC_API_URL);

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
