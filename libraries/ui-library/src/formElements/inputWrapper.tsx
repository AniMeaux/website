import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core/types";
import { ensureArray } from "../ensureArray";

export type InputSize = "small" | "medium";

const InputSizeClassName: { [key in InputSize]: string } = {
  small: "h-8",
  medium: "h-10",
};

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
}: ChildrenProp & StyleProps & InputWrapperProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <span className={cn("relative", { "opacity-50": disabled }, className)}>
      {children}

      {leftAdornments.length > 0 &&
        React.createElement(
          AdornmentContainer,
          { side: "left", size },
          ...leftAdornments
        )}

      {rightAdornments.length > 0 &&
        React.createElement(
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

const AdornmentContainerSideClassName: {
  [key in AdornmentContainerProps["side"]]: string;
} = {
  left: "left-0",
  right: "right-0",
};

function AdornmentContainer({ side, size, children }: AdornmentContainerProps) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-0 px-2 text-black text-opacity-70 flex items-center",
        AdornmentContainerSideClassName[side],
        InputSizeClassName[size]
      )}
    >
      {children}
    </span>
  );
}

// The index correspond to the number of adornments.
// Default spacing: 4
// 1 adornment spacing: 8
const PaddingLeftClassNames = ["pl-4", "pl-12", "pl-20"];
const PaddingRightClassNames = ["pr-4", "pr-12", "pr-20"];

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
    "appearance-none disabled:pointer-events-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 w-full min-w-0 rounded-full border bg-white px-4 text-black text-opacity-80",
    InputSizeClassName[size],
    {
      "border-black border-opacity-10": !hasError,
      "border-red-500": hasError,
    },
    paddingLeftClassName,
    paddingRightClassName
  );
}
