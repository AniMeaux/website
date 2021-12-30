import styled from "styled-components/macro";
import { theme } from "styles/theme";

export const Field = styled.div`
  /* padding: ${theme.spacing.x3} ${theme.spacing.x4}; */
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x2};
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x6};
`;
