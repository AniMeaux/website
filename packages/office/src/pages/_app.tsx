import "focus-visible";
import { AppProps as BaseAppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import { initFirebase } from "../core/initFirebase";
import { PageComponent } from "../core/pageComponent";
import { ScreenSizeContextProvider } from "../core/screenSize";
import "../core/styles.css";
import { CurrentUserContextProvider } from "../core/user/currentUserContext";
import { AppLayout } from "../ui/layouts/appLayout";

initFirebase();

export function PageHead() {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        // Use `maximum-scale=1` to prevent browsers to zoom on form elements.
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
    </Head>
  );
}

type AppProps = Omit<BaseAppProps, "Component"> & {
  Component: PageComponent;
};

export default function App({ Component, pageProps }: AppProps) {
  let children = <Component {...pageProps} />;

  if (Component.WrapperComponent != null) {
    children = (
      <Component.WrapperComponent>{children}</Component.WrapperComponent>
    );
  }

  return (
    <>
      <PageHead />

      <ScreenSizeContextProvider>
        <CurrentUserContextProvider
          resourcePermissionKey={Component.resourcePermissionKey}
        >
          <AppLayout>{children}</AppLayout>
        </CurrentUserContextProvider>
      </ScreenSizeContextProvider>
    </>
  );
}
