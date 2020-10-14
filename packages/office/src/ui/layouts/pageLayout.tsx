import * as React from "react";
import { Navigation } from "./navigation";
import { PageHead } from "./pageHead";

type PageLayoutProps = {
  children?: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageHead />
      {children}
      <Navigation />
    </>
  );
}
