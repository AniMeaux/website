import cn from "classnames";
import { ensureArray } from "core/ensureArray";
import { ChildrenProp, StyleProps } from "core/types";
import invariant from "invariant";
import { createElement } from "react";

export type InputSize = "small" | "medium";

export type InputWrapperProps = {
  disabled?: boolean;
  size?: InputSize;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  hasError?: boolean | null;
};

export function InputWrapper({
  children,
  disabled = false,
  size = "medium",
  leftAdornment,
  rightAdornment,
  className,
  style,
}: ChildrenProp & StyleProps & InputWrapperProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <span
      style={style}
      className={cn(
        "InputWrapper",
        { "InputWrapper--disabled": disabled },
        className
      )}
    >
      {children}

      {leftAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "left", size },
          ...leftAdornments
        )}

      {rightAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "right", size },
          ...rightAdornments
        )}
    </span>
  );
}

type AdornmentContainerProps = ChildrenProp & {
  side: "left" | "right";
  size: InputSize;
};

const AdornmentContainerSizeClassName: Record<InputSize, string> = {
  small: "AdornmentContainer--small",
  medium: "",
};

const AdornmentContainerSideClassName: Record<
  AdornmentContainerProps["side"],
  string
> = {
  left: "AdornmentContainer--left",
  right: "AdornmentContainer--right",
};

function AdornmentContainer({ side, size, children }: AdornmentContainerProps) {
  return (
    <span
      className={cn(
        "AdornmentContainer",
        AdornmentContainerSideClassName[side],
        AdornmentContainerSizeClassName[size]
      )}
    >
      {children}
    </span>
  );
}

// The index correspond to the number of adornments.
const PaddingLeftClassNames = [
  "",
  "InputWrapper__input--pl1",
  "InputWrapper__input--pl2",
];

const PaddingRightClassNames = [
  "",
  "InputWrapper__input--pr1",
  "InputWrapper__input--pr2",
];

const InputSizeClassName: Record<InputSize, string> = {
  small: "InputWrapper__input--small",
  medium: "InputWrapper__input--medium",
};

export function getInputClassName({
  hasError = false,
  size = "medium",
  leftAdornment,
  rightAdornment,
}: InputWrapperProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  const paddingLeftClassName = PaddingLeftClassNames[leftAdornments.length];
  invariant(paddingLeftClassName != null, "Only 2 adornments are supported.");

  const paddingRightClassName = PaddingRightClassNames[rightAdornments.length];
  invariant(paddingRightClassName != null, "Only 2 adornments are supported.");

  return cn(
    "InputWrapper__input",
    InputSizeClassName[size],
    { "InputWrapper__input--error": hasError },
    paddingLeftClassName,
    paddingRightClassName
  );
}
