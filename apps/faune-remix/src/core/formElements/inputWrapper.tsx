import { createElement } from "react";
import { cn } from "~/core/classNames";
import { ensureArray } from "~/core/ensureArray";

export type InputWrapperProps = {
  isDisabled?: boolean;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
};

export function InputWrapper({
  children,
  isDisabled = false,
  leftAdornment,
  rightAdornment,
  className,
}: InputWrapperProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <span
      className={cn(className, "relative inline-flex", {
        "opacity-60": isDisabled,
      })}
    >
      {children}

      {leftAdornments.length > 0 &&
        createElement(AdornmentContainer, { side: "left" }, ...leftAdornments)}

      {rightAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "right" },
          ...rightAdornments
        )}
    </span>
  );
}

function AdornmentContainer({
  side,
  children,
}: {
  side: "left" | "right";
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute top-1 flex items-center gap-0.5 pointer-events-none",
        {
          "left-1": side === "left",
          "right-1": side === "right",
        }
      )}
    >
      {children}
    </span>
  );
}

export function inputClassName({
  hasError = false,
  leftAdornment,
  rightAdornment,
}: {
  hasError?: boolean;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
} = {}) {
  const leftAdornmentCount = ensureArray(leftAdornment).length;
  const rightAdornmentCount = ensureArray(rightAdornment).length;

  return cn(
    "appearance-none w-full min-w-0 rounded-0.5 ring-inset ring-1 py-1 placeholder:text-gray-500",
    {
      "ring-red-500": hasError,
      "ring-gray-100": !hasError,
    },
    {
      "pl-1": leftAdornmentCount === 0,
      "pl-[35px]": leftAdornmentCount === 1,
    },
    {
      "pr-1": rightAdornmentCount === 0,
      "pr-[35px]": rightAdornmentCount === 1,
      "pr-[60px]": rightAdornmentCount === 2,
    }
  );
}
