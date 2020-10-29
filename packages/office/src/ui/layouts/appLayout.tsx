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

      <div className="min-h-screen md:flex md:items-stretch">
        <Navigation className="md:flex-none" />
        <div className="relative md:flex-1 md:min-w-0">{children}</div>
      </div>
    </>
  );
}
