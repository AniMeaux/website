import cn from "classnames";
import * as React from "react";

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  errorMessage?: string | null;
  infoMessage?: string | null;
  value?: string | null;
  onChange?: React.Dispatch<React.SetStateAction<string | null>>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export function Select({
  errorMessage,
  infoMessage,
  placeholder,
  value,
  onChange,
  leftAdornment,
  rightAdornment,
  children,
  className,
  ...rest
}: SelectProps) {
  return (
    <span className={cn("relative", className)}>
      <select
        {...rest}
        value={value ?? ""}
        onChange={(event) => {
          if (onChange != null) {
            onChange(event.target.value);
          }
        }}
        className={cn(
          "a11y-focus appearance-none h-10 w-full min-w-0 rounded-md bg-black bg-opacity-5 md:hover:bg-opacity-3 focus:bg-transparent px-4 truncate cursor-pointer text-default-color",
          {
            "text-opacity-70": value == null,
            "pl-12": leftAdornment != null,
            "pr-12": rightAdornment != null,
            "border-2 border-red-500": errorMessage != null,
          }
        )}
      >
        <option disabled value="">
          {placeholder}
        </option>

        {children}
      </select>

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

      {infoMessage != null && errorMessage == null && (
        <p className="mt-1 text-sm text-opacity-90 text-default-color">
          {infoMessage}
        </p>
      )}
    </span>
  );
}
