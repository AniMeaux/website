import cn from "classnames";
import * as React from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  hasError?: boolean;
  errorMessage?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
};

export function Input({
  hasError,
  errorMessage,
  onChange,
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
        className={cn("h-10 w-full rounded-md px-4 a11y-focus", {
          "border border-gray-300": !hasError,
          "border-2 border-red-500": hasError,
        })}
      />

      {errorMessage != null && (
        <p className="mt-1 text-sm text-red-500 font-medium">{errorMessage}</p>
      )}
    </span>
  );
}
