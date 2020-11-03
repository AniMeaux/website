import * as React from "react";
import { Navigation } from "./navigation";

type PageLayoutProps = {
  children?: React.ReactNode;
};

export function AppLayout({ children }: PageLayoutProps) {
  return (
    <div className="md:h-screen md:flex md:items-stretch">
      <Navigation />
      {children}
    </div>
  );
}