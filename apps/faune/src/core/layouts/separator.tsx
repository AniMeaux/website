import styled from "styled-components/macro";
import { theme } from "styles/theme";

export const Separator = styled.hr`
  margin: 0 ${theme.spacing.x4};
  border: none;
  border-top: 1px solid ${theme.colors.dark[50]};
`;
