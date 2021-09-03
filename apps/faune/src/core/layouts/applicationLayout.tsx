import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import invariant from "invariant";
import { createContext, useContext, useMemo, useState } from "react";

type ApplicationLayoutState = {
  hasNavigation: boolean;
};

export type ApplicationLayoutContextValue = ApplicationLayoutState & {
  setState: React.Dispatch<React.SetStateAction<ApplicationLayoutState>>;
};

const ApplicationLayoutContext =
  createContext<ApplicationLayoutContextValue | null>(null);

export function useApplicationLayout() {
  const context = useContext(ApplicationLayoutContext);

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
  const [state, setState] = useState<ApplicationLayoutState>({
    hasNavigation: false,
  });

  const value = useMemo<ApplicationLayoutContextValue>(
    () => ({ ...state, setState }),
    [state]
  );

  return (
    <ApplicationLayoutContext.Provider value={value}>
      <div {...rest} className={cn("ApplicationLayout", className)} />
    </ApplicationLayoutContext.Provider>
  );
}
