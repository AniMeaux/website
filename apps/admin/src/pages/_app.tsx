import "react-app-polyfill/stable";
import "focus-visible";
import "@animeaux/ui-library/styles.css";

import {
  ApplicationProviders,
  initializeGraphQlClient,
  PageComponent,
  PageHead,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import { AppProps as BaseAppProps } from "next/app";
import * as React from "react";
import Logo from "../core/appLogo.svg";
import { initFirebase } from "../core/initFirebase";

initFirebase();
initializeGraphQlClient(process.env.NEXT_PUBLIC_API_URL);

type AppProps = Omit<BaseAppProps, "Component"> & {
  Component: PageComponent;
};

const AUTHORISED_GROUPS = [UserGroup.ADMIN];

export default function App({ Component, pageProps }: AppProps) {
  let children = <Component {...pageProps} />;

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
        authorisedGroupsForPage={Component.authorisedGroups}
      >
        {children}
      </ApplicationProviders>
    </>
  );
}
