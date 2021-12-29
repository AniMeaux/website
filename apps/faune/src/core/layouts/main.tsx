import { useApplicationLayout } from "core/layouts/applicationLayout";
import { ChildrenProp, StyleProps } from "core/types";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

export type MainProps = ChildrenProp & StyleProps;
export function Main(props: MainProps) {
  const { hasNavigation } = useApplicationLayout();
  return <MainElement {...props} $hasNavigation={hasNavigation} />;
}

const MainElement = styled.main<{ $hasNavigation: boolean }>`
  grid-area: main;
  padding-left: 0;
  padding-left: env(safe-area-inset-left, 0);

  padding-right: 0;
  /* The navigation is at the bottom so we need to compensate for safe area. */
  padding-right: env(safe-area-inset-right, 0);

  padding-bottom: ${(props) =>
    props.$hasNavigation ? theme.components.bottomNavHeight : "0"};
  padding-bottom: calc(
    ${(props) =>
        props.$hasNavigation ? theme.components.bottomNavHeight : "0"} +
      env(safe-area-inset-bottom, 0)
  );

  background: ${theme.colors.background.primary};

  @media (min-width: 500px) {
    padding-right: 0;
  }
`;
