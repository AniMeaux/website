import cn from "classnames";
import * as React from "react";

export type RawRadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange?: React.Dispatch<React.SetStateAction<void>>;
};

export function RawRadio({ onChange, readOnly, ...rest }: RawRadioProps) {
  return (
    <input
      {...rest}
      type="radio"
      readOnly={readOnly}
      onChange={() => {
        if (onChange != null && !readOnly) {
          onChange();
        }
      }}
    />
  );
}

type RadioSize = "medium" | "small";

const RadioSizeClassName: {
  [key in RadioSize]: {
    input: string;
    inputChecked: string;
    checkMark: string;
  };
} = {
  medium: {
    input: "w-5 h-5",
    inputChecked: "border-2",
    checkMark: "w-3 h-3",
  },
  small: {
    input: "w-3 h-3",
    inputChecked: "border",
    checkMark: "w-2 h-2",
  },
};

export type RadioProps = Omit<RawRadioProps, "size"> & {
  size?: RadioSize;
};

export function Radio({
  checked,
  size = "medium",
  className,
  ...rest
}: RadioProps) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <RawRadio
        {...rest}
        checked={checked}
        className={cn(
          "a11y-focus appearance-none rounded-full",
          RadioSizeClassName[size].input,
          {
            "border-blue-500": checked,
            "bg-white border border-gray-400": !checked,
            [RadioSizeClassName[size].inputChecked]: checked,
          }
        )}
      />

      {checked && (
        <span
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full",
            RadioSizeClassName[size].checkMark
          )}
        />
      )}
    </span>
  );
}
