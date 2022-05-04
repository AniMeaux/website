import styled from "styled-components";
import { useApplicationLayout } from "~/core/layouts/applicationLayout";
import { ChildrenProp, StyleProps } from "~/core/types";
import { theme } from "~/styles/theme";

export function Main(props: ChildrenProp & StyleProps) {
  const { hasNavigation } = useApplicationLayout();
  return <MainElement {...props} $hasNavigation={hasNavigation} />;
}

const MainElement = styled.main<{ $hasNavigation: boolean }>`
  grid-area: main;
  padding-left: 0;
  padding-left: env(safe-area-inset-left, 0);

  padding-right: 0;
  padding-right: env(safe-area-inset-right, 0);

  padding-bottom: ${(props) =>
    props.$hasNavigation ? theme.components.bottomNavHeight : "0"};

  /* px suffix is required in a calc in iOS Safari. */
  padding-bottom: calc(
    ${(props) =>
        props.$hasNavigation ? theme.components.bottomNavHeight : "0px"} +
      env(safe-area-inset-bottom, 0)
  );

  background: ${theme.colors.background.primary};

  @media (min-width: 500px) {
    padding-left: 0;
    padding-bottom: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;
