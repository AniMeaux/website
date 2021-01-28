import invariant from "invariant";
import * as React from "react";

export type ApplicationLayoutState = {
  hasBottomNavigation: boolean;
  hasLeftNavigation: boolean;
  isNavigationCollapsed: boolean;
};

export type ApplicationLayoutContextValue = ApplicationLayoutState & {
  setState: React.Dispatch<React.SetStateAction<ApplicationLayoutState>>;
};

const Context = React.createContext<ApplicationLayoutContextValue | null>(null);

export function ApplicationLayout({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState<ApplicationLayoutState>(() => ({
    hasBottomNavigation: false,
    hasLeftNavigation: false,
    isNavigationCollapsed:
      typeof window !== "undefined" &&
      localStorage.getItem("navigation-collapsed") === "true",
  }));

  React.useEffect(() => {
    localStorage.setItem(
      "navigation-collapsed",
      String(state.isNavigationCollapsed)
    );
  }, [state.isNavigationCollapsed]);

  const value = React.useMemo<ApplicationLayoutContextValue>(
    () => ({ ...state, setState }),
    [state]
  );

  return <Context.Provider value={value} children={children} />;
}

export function useApplicationLayout() {
  const context = React.useContext(Context);

  invariant(
    context != null,
    "useApplicationLayout should not be used outside of a ApplicationLayout."
  );

  return context;
}
