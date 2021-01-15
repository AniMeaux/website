import cn from "classnames";
import * as React from "react";
import { FaCheck } from "react-icons/fa";

type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Checkbox({
  checked,
  onChange,
  readOnly,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <span className={cn("relative flex", className)}>
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
        className={cn("a11y-focus appearance-none w-4 h-4 border rounded", {
          "bg-blue-500 border-blue-500": checked,
          "bg-white border-gray-400": !checked,
        })}
      />

      {checked && (
        <FaCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white" />
      )}
    </span>
  );
}
