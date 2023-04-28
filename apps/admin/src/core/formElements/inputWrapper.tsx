import { createElement } from "react";
import { cn } from "~/core/classNames";
import { ensureArray } from "~/core/ensureArray";
import { AdornmentContainer } from "~/core/formElements/adornment";

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

      {leftAdornments.length > 0
        ? createElement(AdornmentContainer, { side: "left" }, ...leftAdornments)
        : null}

      {rightAdornments.length > 0
        ? createElement(
            AdornmentContainer,
            { side: "right" },
            ...rightAdornments
          )
        : null}
    </span>
  );
}

export type InputVariant = "outlined" | "search";

export function inputClassName({
  variant = "outlined",
  leftAdornmentCount = 0,
  rightAdornmentCount = 0,
}: {
  variant?: InputVariant;
  leftAdornmentCount?: number;
  rightAdornmentCount?: number;
} = {}) {
  return cn(
    "appearance-none w-full min-w-0 min-h-[40px] rounded-0.5 ring-inset ring-1 py-1 text-left transition-colors duration-100 ease-in-out placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400 aria-[invalid=true]:ring-red-500 aria-[invalid=true]:focus-visible:ring-red-500 data-[invalid=true]:ring-red-500 data-[invalid=true]:focus-visible:ring-red-500",
    INPUT_VARIANT_CLASS_NAMES[variant],
    {
      "pl-1": leftAdornmentCount === 0,
      "pl-4": leftAdornmentCount === 1,
    },
    {
      "pr-1": rightAdornmentCount === 0,
      "pr-4": rightAdornmentCount === 1,
      "pr-7": rightAdornmentCount === 2,
    }
  );
}

const INPUT_VARIANT_CLASS_NAMES: Record<InputVariant, string> = {
  outlined: "ring-gray-200 bg-transparent",
  search: "ring-gray-100 bg-gray-100",
};
