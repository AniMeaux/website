import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import invariant from "invariant";
import { createContext, useContext, useMemo, useState } from "react";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

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

export function ApplicationLayout(props: ChildrenProp & StyleProps) {
  const [state, setState] = useState<ApplicationLayoutState>({
    hasNavigation: false,
  });

  const value = useMemo<ApplicationLayoutContextValue>(
    () => ({ ...state, setState }),
    [state]
  );

  return (
    <ApplicationLayoutContext.Provider value={value}>
      <Layout {...props} />
    </ApplicationLayoutContext.Provider>
  );
}

const LEFT_NAV_MAX_WIDTH = 250;
const MAIN_MAX_WIDTH = 600;
const APP_LAYOUT_MAX_WIDTH = LEFT_NAV_MAX_WIDTH + MAIN_MAX_WIDTH;

const Layout = styled.div`
  width: 100%;
  max-width: ${APP_LAYOUT_MAX_WIDTH}px;
  margin-left: max(
    0px,
    /* Simulate a right aside (with \`LEFT_NAV_MAX_WIDTH\`) to center the main. */(
        100% - ${LEFT_NAV_MAX_WIDTH + APP_LAYOUT_MAX_WIDTH}px
      ) / 2
  );

  display: grid;
  grid-template-areas:
    "header"
    "main";

  grid-template-rows: max-content 1fr;
  grid-template-columns: 1fr;

  @media (min-width: 500px) {
    box-shadow: 1px 0 0 0 ${theme.colors.dark[50]};
    grid-template-areas:
      "navigation header"
      "navigation main";

    grid-template-columns: minmax(min-content, 1fr) minmax(
        0,
        ${MAIN_MAX_WIDTH}px
      );
  }

  @media (min-width: 750px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, ${MAIN_MAX_WIDTH}px);
  }
`;
