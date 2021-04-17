import cn from "classnames";
import * as React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Button } from "../actions";

type IntegerInputProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "onChange"
> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function IntegerInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  className,
  ...rest
}: IntegerInputProps) {
  return (
    <span {...rest} className={cn("inline-flex items-center", className)}>
      <Button
        type="button"
        iconOnly
        disabled={value <= min}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        <FaMinus />
      </Button>

      <span
        className={cn(
          "h-10 w-10 flex items-center justify-center font-semibold text-black text-opacity-80",
          { "text-opacity-60": value === 0 }
        )}
      >
        {value}
      </span>

      <Button
        type="button"
        iconOnly
        disabled={value >= max}
        onClick={() => {
          onChange(value + 1);
        }}
      >
        <FaPlus />
      </Button>
    </span>
  );
}
