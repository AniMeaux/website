import Document, { Head, Html, Main, NextScript } from "next/document";
import * as React from "react";

export class PageDocument extends Document {
  render() {
    return (
      <Html className="bg-white text-html">
        <Head />

        <body className="font-sans antialiased text-base text-default-color">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
