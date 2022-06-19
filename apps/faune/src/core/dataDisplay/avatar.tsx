import styled from "styled-components";
import { Placeholder } from "~/core/loaders/placeholder";
import { theme } from "~/styles/theme";

export const Avatar = styled.span<{ $isSmall?: boolean }>`
  position: relative;
  overflow: hidden;
  height: ${(props) => (props.$isSmall ? "1em" : "2em")};
  width: ${(props) => (props.$isSmall ? "1em" : "2em")};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;

  /* Use a pseudo element to have a background opacity. */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0.1;
  }
`;

export const AvatarPlaceholder = styled(Placeholder)`
  width: 2em;
  height: 2em;

  &::after {
    height: 100%;
  }
`;
