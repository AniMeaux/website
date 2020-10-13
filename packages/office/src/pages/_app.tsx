import "focus-visible";
import { AppProps as BaseAppProps } from "next/app";
import * as React from "react";
import { initFirebase } from "../core/initFirebase";
import { PageComponent } from "../core/pageComponent";
import { ScreenSizeContextProvider } from "../core/screenSize";
import "../core/styles.css";
import { CurrentUserContextProvider } from "../core/user";

initFirebase();

type AppProps = Omit<BaseAppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ScreenSizeContextProvider>
      <CurrentUserContextProvider
        resourcePermissionKey={Component.resourcePermissionKey}
      >
        <Component {...pageProps} />
      </CurrentUserContextProvider>
    </ScreenSizeContextProvider>
  );
}
