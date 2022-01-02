import styled, { css } from "styled-components";
import { theme } from "styles/theme";

export const ADORNMENT_SIZE = 32;

const COMMON_STYLES = css`
  width: ${ADORNMENT_SIZE}px;
  height: ${ADORNMENT_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

export const Adornment = styled.span`
  ${COMMON_STYLES};
`;

export const ActionAdornment = styled.button.attrs({
  // Use type button to make sure we don't submit a form.
  type: "button",
})`
  ${COMMON_STYLES};
  border-radius: ${theme.borderRadius.full};
  pointer-events: auto;

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.dark[30]};
    }
  }

  &:active {
    background: ${theme.colors.dark[50]};
  }
`;
