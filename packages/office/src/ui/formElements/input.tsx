import cn from "classnames";
import * as React from "react";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  errorMessage?: string | null;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export function Input({
  errorMessage,
  onChange,
  leftAdornment,
  rightAdornment,
  className,
  ...rest
}: InputProps) {
  return (
    <span className={cn("relative", className)}>
      <input
        {...rest}
        onChange={(event) => {
          if (onChange != null) {
            onChange(event.target.value);
          }
        }}
        className={cn(
          "a11y-focus h-10 w-full rounded-md px-4 placeholder-gray-500",
          {
            "pl-12": leftAdornment != null,
            "pr-12": rightAdornment != null,
            "border-2 border-red-500": errorMessage != null,
          },
          "bg-gray-100 focus:bg-white"
        )}
      />

      {leftAdornment != null && (
        <span className="absolute top-0 left-0 h-10 pl-2 text-gray-700 flex items-center">
          {leftAdornment}
        </span>
      )}

      {rightAdornment != null && (
        <span className="absolute top-0 right-0 h-10 pr-2 text-gray-700 flex items-center">
          {rightAdornment}
        </span>
      )}

      {errorMessage != null && (
        <p className="mt-1 text-sm text-red-500 font-medium">{errorMessage}</p>
      )}
    </span>
  );
}
