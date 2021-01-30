import * as React from "react";
import { RequestContextProvider } from "./request";
import {
  CurrentUserContextProvider,
  CurrentUserContextProviderProps,
} from "./user";

export function ApplicationProviders(props: CurrentUserContextProviderProps) {
  return (
    <RequestContextProvider>
      <CurrentUserContextProvider {...props} />
    </RequestContextProvider>
  );
}
