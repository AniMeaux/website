import {
  ApplicationLayout,
  ScreenSizeContextProvider,
} from "@animeaux/ui-library";
import * as React from "react";
import { RequestContextProvider } from "./request";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "./user";

export function ApplicationProviders(props: CurrentUserContextProviderProps) {
  return (
    <RequestContextProvider>
      <ScreenSizeContextProvider>
        <ApplicationLayout>
          <CurrentUserContextProvider {...props} />
        </ApplicationLayout>
      </ScreenSizeContextProvider>
    </RequestContextProvider>
  );
}
