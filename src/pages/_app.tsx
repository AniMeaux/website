import "focus-visible";
import { AppProps } from "next/app";
import * as React from "react";
import "../core/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
