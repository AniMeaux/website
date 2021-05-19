import { Article } from "@animeaux/shared-entities/build/article";
import invariant from "invariant";
import { createContext, useContext, useMemo } from "react";
import { ChildrenProp } from "~/core/types";

export type ApplicationLayoutContextValue = {
  latestArticles: Article[];
};

export type ApplicationLayoutProps = ChildrenProp &
  ApplicationLayoutContextValue;

const applicationLayoutContext =
  createContext<ApplicationLayoutContextValue | null>(null);

export function useApplicationLayout() {
  const context = useContext(applicationLayoutContext);

  invariant(
    context != null,
    "useApplicationLayout should not be used outside of a ApplicationLayout."
  );

  return context;
}

export function ApplicationLayout({
  latestArticles,
  children,
}: ApplicationLayoutProps) {
  const value = useMemo<ApplicationLayoutContextValue>(
    () => ({ latestArticles }),
    [latestArticles]
  );

  return (
    <applicationLayoutContext.Provider value={value}>
      {children}
    </applicationLayoutContext.Provider>
  );
}
