import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import invariant from "invariant";
import * as React from "react";

type ApplicationLayoutState = {
  hasNavigation: boolean;
};

export type ApplicationLayoutContextValue = ApplicationLayoutState & {
  setState: React.Dispatch<React.SetStateAction<ApplicationLayoutState>>;
};

const ApplicationLayoutContext =
  React.createContext<ApplicationLayoutContextValue | null>(null);

export function useApplicationLayout() {
  const context = React.useContext(ApplicationLayoutContext);

  invariant(
    context != null,
    "useApplicationLayout should not be used outside of a ApplicationLayout."
  );

  return context;
}

export function ApplicationLayout({
  className,
  ...rest
}: ChildrenProp & StyleProps) {
  const [state, setState] = React.useState<ApplicationLayoutState>({
    hasNavigation: false,
  });

  const value = React.useMemo<ApplicationLayoutContextValue>(
    () => ({ ...state, setState }),
    [state]
  );

  return (
    <ApplicationLayoutContext.Provider value={value}>
      <div {...rest} className={cn("ApplicationLayout", className)} />
    </ApplicationLayoutContext.Provider>
  );
}
