import styled from "styled-components";
import { theme } from "~/styles/theme";

export const Main = styled.main`
  grid-area: main;
  padding-left: 0;
  padding-left: env(safe-area-inset-left, 0);

  padding-right: 0;
  padding-right: env(safe-area-inset-right, 0);

  padding-bottom: ${theme.components.bottomNavHeight};

  padding-bottom: calc(
    ${theme.components.bottomNavHeight} + env(safe-area-inset-bottom, 0)
  );

  background: ${theme.colors.background.primary};

  @media (min-width: 500px) {
    padding-left: 0;
    padding-bottom: 0;
    padding-bottom: calc(
      ${theme.components.bottomNavHeight} + env(safe-area-inset-bottom, 0)
    );
  }
`;
