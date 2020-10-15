import cn from "classnames";
import * as React from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  errorMessage?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  rightIcon?: React.ReactNode;
};

export function Input({
  errorMessage,
  onChange,
  rightIcon,
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
          { "pl-12": rightIcon != null },
          "bg-gray-100 focus:bg-white"
        )}
      />

      {rightIcon != null && (
        <span className="absolute top-0 left-0 h-10 pl-4 text-gray-700 flex items-center">
          {rightIcon}
        </span>
      )}

      {errorMessage != null && (
        <p className="mt-1 text-sm text-red-500 font-medium">{errorMessage}</p>
      )}
    </span>
  );
}
