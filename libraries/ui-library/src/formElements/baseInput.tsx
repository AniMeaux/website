import cn from "classnames";
import * as React from "react";
import invariant from "invariant";

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
  errorMessage?: string | null;
  infoMessage?: string | null;
};

export function BaseInput({
  children,
  disabled = false,
  leftAdornment,
  rightAdornment,
  errorMessage,
  infoMessage,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & BaseInputProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <span
      {...rest}
      className={cn("relative", { "opacity-75": disabled }, className)}
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

      {errorMessage != null && <Message error>{errorMessage}</Message>}

      {infoMessage != null && errorMessage == null && (
        <Message>{infoMessage}</Message>
      )}
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
        "pointer-events-none absolute top-0 h-10 px-2 text-gray-700 flex items-center",
        AdornmentSideClassName[side],
        className
      )}
    />
  );
}

type MessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  error?: boolean;
};

function Message({ error = false, className, ...rest }: MessageProps) {
  return (
    <p
      {...rest}
      className={cn(
        "mt-1 text-sm",
        {
          "text-red-500 font-medium": error,
          "text-opacity-90 text-default-color": !error,
        },
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
    "appearance-none a11y-focus disabled:pointer-events-none h-10 w-full min-w-0 rounded-md bg-black bg-opacity-5 focus:bg-transparent px-4 text-default-color",
    { "border-2 border-red-500": errorMessage != null },
    paddingLeftClassName,
    paddingRightClassName
  );
}
