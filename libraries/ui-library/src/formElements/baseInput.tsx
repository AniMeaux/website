import cn from "classnames";
import invariant from "invariant";
import * as React from "react";
import { FieldMessage } from "./fieldMessage";

function ensureArray<DataType>(value: DataType[] | DataType | null) {
  if (value == null) {
    return [];
  }

  const array = Array.isArray(value) ? value : [value];
  return array.filter(Boolean);
}

export type BaseInputProps = {
  disabled?: boolean;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  hasError?: boolean | null;
  errorMessage?: string | null;
  infoMessage?: string | null;
};

export function BaseInput({
  children,
  disabled = false,
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
          { side: "left" },
          ...leftAdornments
        )}

      {rightAdornments.length > 0 &&
        React.createElement(
          AdornmentContainer,
          { side: "right" },
          ...rightAdornments
        )}

      <FieldMessage errorMessage={errorMessage} infoMessage={infoMessage} />
    </span>
  );
}

type AdornmentContainerProps = React.HTMLAttributes<HTMLSpanElement> & {
  side: "left" | "right";
};

const AdornmentSideClassName: {
  [key in AdornmentContainerProps["side"]]: string;
} = {
  left: "left-0",
  right: "right-0",
};

function AdornmentContainer({
  side,
  className,
  ...rest
}: AdornmentContainerProps) {
  return (
    <span
      {...rest}
      className={cn(
        "pointer-events-none absolute top-0 h-10 px-2 text-black text-opacity-70 flex items-center",
        AdornmentSideClassName[side],
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
    "appearance-none disabled:pointer-events-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 h-10 w-full min-w-0 rounded-full border bg-white px-4 text-default-color",
    {
      "border-black border-opacity-10": !hasError,
      "border-red-500": hasError,
    },
    paddingLeftClassName,
    paddingRightClassName
  );
}
