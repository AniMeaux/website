import { StyleProps } from "core/types";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { theme } from "styles/theme";

type FieldMessagePlacement = "top" | "bottom";

type FieldMessageProps = StyleProps & {
  placement?: FieldMessagePlacement;
  infoMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
};

export function FieldMessage({
  placement = "bottom",
  infoMessage,
  errorMessage,
  ...rest
}: FieldMessageProps) {
  if (infoMessage != null || errorMessage != null) {
    return (
      <FieldMessageElement
        {...rest}
        $isError={errorMessage != null}
        $placement={placement}
      >
        {errorMessage ?? infoMessage}
      </FieldMessageElement>
    );
  }

  return null;
}

const PLACEMENT_STYLES: Record<
  FieldMessagePlacement,
  FlattenSimpleInterpolation
> = {
  bottom: css`
    margin-top: ${theme.spacing.x1};
  `,
  top: css`
    margin-bottom: ${theme.spacing.x1};
  `,
};

const FieldMessageElement = styled.p<{
  $isError: boolean;
  $placement: FieldMessagePlacement;
}>`
  ${(props) => PLACEMENT_STYLES[props.$placement]};
  padding: 0 ${theme.spacing.x4};
  font-size: 12px;
  line-height: ${theme.typography.lineHeight.monoLine};
  color: ${(props) =>
    props.$isError ? theme.colors.alert[500] : theme.colors.text.secondary};
`;
