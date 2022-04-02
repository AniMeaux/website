import styled from "styled-components";
import { theme } from "styles/theme";

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x2};
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.x6};
`;

export const AsideFields = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.x4};

  & > ${Field} {
    flex: 1;
    min-width: 0;
  }
`;
