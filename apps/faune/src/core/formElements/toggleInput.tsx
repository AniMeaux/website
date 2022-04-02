import { Label } from "core/formElements/label";
import styled, { css } from "styled-components";
import { theme } from "styles/theme";

type ToggleInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  isOptional?: boolean;
  hasError?: boolean;
};

export function ToggleInput({
  label,
  isOptional = false,
  hasError = false,
  className,
  style,
  ...rest
}: ToggleInputProps) {
  return (
    <Container className={className} style={style}>
      <ToggleLabel
        forwardedAs="span"
        isOptional={isOptional}
        hasError={hasError}
      >
        {label}
      </ToggleLabel>

      <Toggle {...rest} />
    </Container>
  );
}

const Container = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.x4};
  cursor: pointer;
`;

const ToggleLabel = styled(Label)`
  flex: 1;
  min-width: 0;
`;

const SPACING = "2px";

const NATIVE_INPUT_UNCHECKED = css`
  background: ${theme.colors.dark[100]};

  &::after {
    transform: translate3d(0, 0, 0);
  }
`;

const NATIVE_INPUT_CHECKED = css`
  background: ${theme.colors.primary[500]};

  &::after {
    transform: translate3d(calc(var(--knob-size) - ${SPACING}), 0, 0);
  }
`;

const Toggle = styled.input.attrs({ type: "checkbox" })`
  --knob-size: 24px;

  appearance: none;
  width: calc(var(--knob-size) * 2 + ${SPACING});
  height: calc(var(--knob-size) + ${SPACING} * 2);
  padding: ${SPACING};
  border-radius: calc((var(--knob-size) + ${SPACING} * 2) / 2);
  transition-property: background;
  transition-duration: ${theme.animation.duration.fast};
  transition-timing-function: ${theme.animation.ease.move};

  &::after {
    content: "";
    width: var(--knob-size);
    height: var(--knob-size);
    border-radius: 50%;
    display: flex;
    background: white;
    pointer-events: none;
    transition-property: transform;
    transition-duration: inherit;
    transition-timing-function: inherit;
  }

  ${(props) => (props.checked ? NATIVE_INPUT_CHECKED : NATIVE_INPUT_UNCHECKED)};
`;
