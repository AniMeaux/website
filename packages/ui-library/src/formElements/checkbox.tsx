import cn from "classnames";
import * as React from "react";
import { FaCheck } from "react-icons/fa";

type CheckboxSize = "medium" | "small";

const CheckboxSizeClassName: {
  [key in CheckboxSize]: {
    input: string;
    checkMark: string;
  };
} = {
  medium: {
    input: "w-5 h-5",
    checkMark: "text-s",
  },
  small: {
    input: "w-3 h-3",
    checkMark: "text-2xs",
  },
};

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
> & {
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
  size?: CheckboxSize;
};

export function Checkbox({
  checked,
  onChange,
  size = "medium",
  readOnly,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <input
        {...rest}
        type="checkbox"
        checked={checked}
        readOnly={readOnly}
        onChange={(event) => {
          if (onChange != null && !readOnly) {
            onChange(event.target.checked);
          }
        }}
        className={cn(
          "a11y-focus appearance-none border rounded",
          CheckboxSizeClassName[size].input,
          {
            "bg-blue-500 border-blue-500": checked,
            "bg-white border-gray-400": !checked,
          }
        )}
      />

      {checked && (
        <FaCheck
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white",
            CheckboxSizeClassName[size].checkMark
          )}
        />
      )}
    </span>
  );
}

export function CheckboxInput({
  className,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...rest}
      className={cn("cursor-pointer h-10 flex items-center", className)}
    />
  );
}
