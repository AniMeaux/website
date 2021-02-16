import cn from "classnames";
import * as React from "react";
import { FaCheck } from "react-icons/fa";

export type RawCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
> & {
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function RawCheckbox({
  checked,
  onChange,
  readOnly,
  ...rest
}: RawCheckboxProps) {
  return (
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
    />
  );
}

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

export type CheckboxProps = RawCheckboxProps & {
  size?: CheckboxSize;
};

export function Checkbox({
  checked,
  size = "medium",
  readOnly,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <RawCheckbox
        {...rest}
        checked={checked}
        readOnly={readOnly}
        className={cn(
          "appearance-none border rounded",
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
