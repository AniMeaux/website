import { Button, ButtonProps } from "core/actions/button";
import { useIsScrollAtTheBottom } from "core/layouts/usePageScroll";
import { Spinner } from "core/loaders/spinner";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

type SubmitButtonProps = ButtonProps & {
  loading?: boolean;
};

export function SubmitButton({
  type = "submit",
  variant = "primary",
  loading = false,
  children,
  ...rest
}: SubmitButtonProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <SubmitButtonElement
      {...rest}
      type={type}
      variant={variant}
      $hasScroll={!isAtTheBottom}
    >
      <span>{children}</span>

      {loading && (
        <SpinnerElement>
          <Spinner />
        </SpinnerElement>
      )}
    </SubmitButtonElement>
  );
}

const SubmitButtonElement = styled(Button)<{ $hasScroll: boolean }>`
  position: sticky;
  bottom: ${theme.spacing.x8};
  bottom: calc(${theme.spacing.x8} + env(safe-area-inset-bottom, 0));
  margin: ${theme.spacing.x8} ${theme.spacing.x4};
  align-self: center;
  transition-property: box-shadow;
  transition-duration: ${theme.animation.duration.fast};
  transition-timing-function: ${theme.animation.ease.move};
  box-shadow: ${(props) => (props.$hasScroll ? theme.shadow.m : "none")};
`;

const SpinnerElement = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: calc(${theme.typography.lineHeight.multiLine} * 1em);
`;
