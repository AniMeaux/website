import styled, { css, keyframes } from "styled-components";
import { Button } from "~/core/actions/button";
import { useIsScrollAtTheBottom } from "~/core/layouts/usePageScroll";
import { ChildrenProp } from "~/core/types";
import { theme } from "~/styles/theme";

type SubmitButtonProps = ChildrenProp & {
  loading?: boolean;
};

export function SubmitButton({ loading = false, children }: SubmitButtonProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <SubmitButtonElement
      type="submit"
      variant="primary"
      $hasScroll={!isAtTheBottom}
      $isLoading={loading}
    >
      {children}
    </SubmitButtonElement>
  );
}

const AnimationPulse = keyframes`
  0% {
    background-position: -1000px 0;
  }

  100% {
    background-position: 1000px 0;
  }
`;

const LOADING_STYLES = css`
  background: linear-gradient(
    to right,
    ${theme.colors.primary[300]},
    ${theme.colors.primary[700]} 50%,
    ${theme.colors.primary[300]}
  );
  background-size: 1000px auto;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${AnimationPulse};
  animation-timing-function: linear;
`;

const SubmitButtonElement = styled(Button)<{
  $hasScroll: boolean;
  $isLoading: boolean;
}>`
  position: sticky;
  bottom: ${theme.spacing.x8};
  bottom: calc(${theme.spacing.x8} + env(safe-area-inset-bottom, 0));
  margin-bottom: ${theme.spacing.x8};
  align-self: center;
  line-height: ${theme.typography.lineHeight.multiLine};
  transition-property: box-shadow;
  transition-duration: ${theme.animation.duration.fast};
  transition-timing-function: ${theme.animation.ease.move};
  box-shadow: ${(props) => (props.$hasScroll ? theme.shadow.m : "none")};

  ${(props) => (props.$isLoading ? LOADING_STYLES : null)};

  /* Override hover state. */
  @media (hover: hover) {
    &:hover {
      ${(props) => (props.$isLoading ? LOADING_STYLES : null)};
    }
  }

  /* Override active state. */
  &:active {
    ${(props) => (props.$isLoading ? LOADING_STYLES : null)};
  }
`;
