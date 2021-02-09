import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import { ensureArray } from "../ensureArray";
import { FieldMessage } from "./fieldMessage";

export type InputSize = "small" | "medium";

const InputSizeClassName: { [key in InputSize]: string } = {
  small: "h-8",
  medium: "h-10",
};

export type BaseInputProps = {
  disabled?: boolean;
  size?: InputSize;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  hasError?: boolean | null;
  errorMessage?: string | null;
  infoMessage?: string | null;
};

export function BaseInput({
  children,
  disabled = false,
  size = "medium",
  leftAdornment,
  rightAdornment,
  errorMessage,
  hasError,
  infoMessage,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & BaseInputProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <span
      {...rest}
      className={cn("relative", { "opacity-50": disabled }, className)}
    >
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

      <FieldMessage errorMessage={errorMessage} infoMessage={infoMessage} />
    </span>
  );
}

type AdornmentContainerProps = React.HTMLAttributes<HTMLSpanElement> & {
  side: "left" | "right";
  size: InputSize;
};

const AdornmentSideClassName: {
  [key in AdornmentContainerProps["side"]]: string;
} = {
  left: "left-0",
  right: "right-0",
};

function AdornmentContainer({
  side,
  size,
  className,
  ...rest
}: AdornmentContainerProps) {
  return (
    <span
      {...rest}
      className={cn(
        "pointer-events-none absolute top-0 px-2 text-black text-opacity-70 flex items-center",
        AdornmentSideClassName[side],
        InputSizeClassName[size],
        className
      )}
    />
  );
}

type GetInputClassNameOptions = Omit<
  BaseInputProps,
  "infoMessage" | "disabled"
>;

// The index correspond to the number of adornments.
const PaddingLeftClassNames = ["pl-4", "pl-12", "pl-20"];
const PaddingRightClassNames = ["pr-4", "pr-12", "pr-20"];

export function getInputClassName({
  errorMessage,
  hasError = errorMessage != null,
  size = "medium",
  leftAdornment,
  rightAdornment,
}: GetInputClassNameOptions) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  const paddingLeftClassName = PaddingLeftClassNames[leftAdornments.length];
  invariant(paddingLeftClassName != null, "Only 2 adornments are supported.");

  const paddingRightClassName = PaddingRightClassNames[rightAdornments.length];
  invariant(paddingRightClassName != null, "Only 2 adornments are supported.");

  return cn(
    "appearance-none disabled:pointer-events-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 w-full min-w-0 rounded-full border bg-white px-4 text-default-color",
    InputSizeClassName[size],
    {
      "border-black border-opacity-10": !hasError,
      "border-red-500": hasError,
    },
    paddingLeftClassName,
    paddingRightClassName
  );
}
