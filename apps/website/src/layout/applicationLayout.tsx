import { Article, Partner } from "@animeaux/shared";
import { ChildrenProp } from "core/types";
import invariant from "invariant";
import { createContext, useContext, useMemo } from "react";

export type ApplicationLayoutContextValue = {
  latestArticles: Article[];
  partners: Partner[];
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
  partners,
  children,
}: ApplicationLayoutProps) {
  const value = useMemo<ApplicationLayoutContextValue>(
    () => ({ latestArticles, partners }),
    [latestArticles, partners]
  );

  return (
    <applicationLayoutContext.Provider value={value}>
      {children}
    </applicationLayoutContext.Provider>
  );
}
