import * as React from "react";
import { Navigation } from "./navigation";
import { PageHead } from "./pageHead";

type PageLayoutProps = {
  children?: React.ReactNode;
};

export function AppLayout({ children }: PageLayoutProps) {
  return (
    <>
      <PageHead />

      <div className="md:h-screen md:flex md:items-stretch">
        <Navigation />
        {children}
      </div>
    </>
  );
}
